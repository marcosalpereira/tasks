#!/bin/bash
gitIssuesUrl=$1
rnFile=$2

currentVersion=v$(grep version package.json | head -1 | awk -F: '{print $2}' | sed 's/[ ",]'//g)
previousVersion=$(git tag --sort=-taggerdate | awk "/$currentVersion/{getline; print}")

tmpLogFile=$(mktemp /tmp/rn-git-log.XXXXXX)
echo  "${previousVersion}..${currentVersion}"
git log ${previousVersion}..${currentVersion} --format="%d%s" > ${tmpLogFile}

tmpRelNotes=$(mktemp /tmp/rn-new.XXXXXX)
node scripts/release-notes.js ${gitIssuesUrl} ${tmpLogFile} ${tmpRelNotes}

cat ${rnFile} >> ${tmpRelNotes}
mv ${tmpRelNotes} ${rnFile} 

gedit --new-window --wait ${rnFile}
git add package.json ${rnFile}
git commit -m "Release notes of ${currentVersion}"
