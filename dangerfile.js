const { message, warn, fail, danger } = require('danger');
const path = require('path');

const JIRA_ISSUE_REGEXP = /^\[(\w+\-\d+)\]/;
const BRANCH_FORMAT_REGEXP = /^(\w+?)\//;

const { href: createLink } = danger.utils;
const modifiedMD = danger.git.modified_files.join('- ');
const [, jiraId] = danger.github.pr.title.match(JIRA_ISSUE_REGEXP) || [];
const [, changeType] =
  danger.github.pr.head.ref.match(BRANCH_FORMAT_REGEXP) || [];
const { pr } = danger.github;
const { created_files, modified_files } = danger.git;

message('Changed Files in this PR: \n - ' + modifiedMD);

if (
  pr.assignee === null &&
  !pr.labels.some(({ name }) =>
    ['wip', 'work in progress'].includes(name.toLowerCase())
  )
) {
  warn('Please assign people who should review.');
}

if (!jiraId) {
  warn(`PR title should start with task id, e.g: "[PROJECT-01] Issue title"`);
} else {
  message(
    createLink(
      `https://10clouds.atlassian.net/browse/${jiraId}`,
      'Go to issue page'
    )
  );
}

if (
  !changeType ||
  !['wip', 'feature', 'bugfix', 'junk'].includes(changeType.toLowerCase())
) {
  warn(`
Please use well-defined tokens in your branch name:

wip - Works in progress; stuff I know won't be finished soon
feature - Feature I'm adding or expanding
bugfix - Bug fix or experiment
junk - Throwaway branch created to experiment

E.g: feature/libraries-upgrade

This allow us to quick search branches:
$ git branch --list "feature/*"
feature/foo
feature/frabnotz
  `);
}

if (
  [...created_files, ...modified_files].some(file =>
    ['.css', '.sass', '.scss', '.less'].includes(path.extname(file))
  )
) {
  try {
    require.resolve('stylelint');
  } catch (error) {
    warn(`
It seems that you're working on styles but I can't find linter in the codebase.
${createLink(
      'https://stylelint.io/user-guide/',
      'Consider adding stylelint to your application'
    )}
`);
  }
}
