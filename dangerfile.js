import { message, warn, fail, danger } from 'danger';

const modifiedMD = danger.git.modified_files.join('- ');
message('Changed Files in this PR: \n - ' + modifiedMD);

if (danger.github.pr.assignee === null) {
  const method = pr.title.includes('WIP') ? warn : fail;
  method(
    'Please assign someone to merge this PR, and optionally include people who should review.'
  );
}

if (!/^\[\w+\-\d+\]/.test(danger.github.pr.title)) {
  warn(`PR title should start with task id, e.g: "[PROJECT-01] Issue title"`);
}
