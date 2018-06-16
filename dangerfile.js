import { message, warn, danger } from 'danger';

const modifiedMD = danger.git.modified_files.join('- ');
const reviewers = danger.github.requested_reviewers;

message('Changed Files in this PR: \n - ' + modifiedMD);

if (reviewers.length === 0) {
  warn('Please assign reviewers');
}
