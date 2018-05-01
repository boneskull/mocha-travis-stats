'use strict';

const axios = require('axios');
const {URLSearchParams} = require('url');
const stringify = require('csv-stringify/lib/sync');

const TOKEN = process.env.TRAVIS_CI_TOKEN;

// oldest  build we care about (we don't even have this much data)
const START_TS = new Date('2017-10-01T00:00:00Z').getTime();
// after change was made
const SPLIT_TS = new Date('2018-04-07T09:48:00Z').getTime();
const BRANCH = 'master';

// clever or awful?
const repoSlug = new URLSearchParams('mochajs/mocha').toString().slice(0, -1);

const client = axios.create({
  baseURL: 'https://api.travis-ci.org',
  headers: {
    'Travis-API-Version': 3,
    Authorization: `token ${TOKEN}`
  }
});

const passed = [];
const failed = [];
let total = 0;
const getBuilds = async (offset = 0) => {
  const {data} = await client.get(`/repo/${repoSlug}/builds`, {
    params: {offset}
  });
  total += data.builds.length;
  console.error(`${total}...`);
  const {builds} = data;
  data.builds.forEach(build => {
    if (
      build.branch.name === BRANCH &&
      new Date(build.started_at).getTime() >= START_TS &&
      build.state !== 'canceled' &&
      build.state !== 'errored'
    ) {
      (build.state === 'passed' ? passed : failed).push(build);
    }
  });
  const lastBuild = builds[builds.length - 1];
  if (new Date(lastBuild.started_at).getTime() > START_TS) {
    await getBuilds(data['@pagination'].next.offset);
  }
};

(async function() {
  await getBuilds();
  const totalBuildCount = passed.length + failed.length;
  const pctFailed = failed.length / passed.length * 100;
  const preChange = build => new Date(build.started_at).getTime() < SPLIT_TS;
  const postChang = build => new Date(build.started_at).getTime() >= SPLIT_TS;
  const passedPreChange = passed.filter(preChange);
  const passedPostChange = passed.filter(postChange);
  const failedPreChange = failed.filter(preChange);
  const failedPostChange = failed.filter(postChange);
  const avgPassedDurationPreChange =
    passedPreChange.reduce((acc, build) => acc + build.duration, 0) /
    passedPreChange.length;
  const avgPassedDurationPostChange =
    passedPostChange.reduce((acc, build) => acc + build.duration, 0) /
    passedPostChange.length;
  const avgFailedDurationPreChange =
    failedPreChange.reduce((acc, build) => acc + build.duration, 0) /
    failedPreChange.length;
  const avgFailedDurationPostChange =
    failedPostChange.reduce((acc, build) => acc + build.duration, 0) /
    failedPostChange.length;

  console.log(`
Total build count: ${totalBuildCount}
Failed Percentage: ${pctFailed}%
Passed Builds - Average Pre-Change Duration:  ${avgPassedDurationPreChange}
Failed Builds - Average Pre-Change Duration:  ${avgFailedDurationPreChange}
Passed Builds - Average Post-Change Duration: ${avgPassedDurationPostChange}
Failed Builds - Average Post-Change Duration: ${avgFailedDurationPostChange}
`);
})();
