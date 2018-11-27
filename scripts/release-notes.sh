#!/bin/bash
nextVersion=$1
gitIssuesUrl=$2
rnFile=$3

currentVersion=v$(grep version package.json | head -1 | awk -F: '{print $2}' | sed 's/[ ",]'//g)
# previousVersion=$(git tag --sort=-taggerdate | awk "/$currentVersion/{getline; print}")

tmpLogFile=$(mktemp /tmp/rn-git-log.XXXXXX)
git log ${currentVersion}.. --format="%d%s" >> ${tmpLogFile}

tmpRelNotes=$(mktemp /tmp/rn-new.XXXXXX)
node scripts/release-notes.js ${nextVersion} ${gitIssuesUrl} ${tmpLogFile} ${tmpRelNotes}

cat ${rnFile} >> ${tmpRelNotes}
mv ${tmpRelNotes} ${rnFile} 

