import { message, warn, fail, danger } from 'danger';

const modifiedMD = danger.git.modified_files.join('- ');
message('Changed Files in this PR: \n - ' + modifiedMD);

const { pr } = danger.github;

if (
  pr.assignee === null &&
  !pr.labels.some(({ name }) =>
    ['wip', 'work in progress'].includes(name.toLowerCase())
  )
) {
  warn('Please assign people who should review.');
}

if (!/^\[\w+\-\d+\]/.test(danger.github.pr.title)) {
  warn(`PR title should start with task id, e.g: "[PROJECT-01] Issue title"`);
  message(
    danger.utils.href(
      `https://10clouds.atlassian.net/browse/CCE-190`,
      'Jira issue'
    )
  );
} else {
}
