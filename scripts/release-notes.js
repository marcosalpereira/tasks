// Acrescenta no inicio do arquivo 'releaseNotesFile' 
// a versao corrente e abaixo dela as
// URLs para as issues informadas nas mensagens de commit

if (process.argv.length < 4) {
  console.log('Usage: node <gitIssuesUrl> <gitLogFile> <releaseNotesFile>');
  console.log('Usage: node  <gitLogFile> <releaseNotesFile>');
  process.exit(1);
}

var fs = require('fs');
var gitIssuesUrl = process.argv[2];
var gitLogFile = process.argv[3];
var releaseNotesFile = process.argv[4];

var out = fs.createWriteStream(releaseNotesFile);

let issues = [];

fs.readFileSync(gitLogFile).toString().split('\n').forEach(function (line) { 
	// console.log('line', line);

    const er = /\(.*tag: v([\d\.\-a-z]+)/g;
	const tagMatch = er.exec(line);
	
	if (tagMatch) {
		issues.sort((a,b) => +a - +b).forEach(
			item => {
                // curl -k --header "Private-Token: sm_C1qjuSEH7vtiAwfyy" https://git.serpro/api/v4/projects/dedat%2Fdeat3%2Fngx-suite-rfb/issues/101
                out.write(`- ${gitIssuesUrl}/${item}\n`)
            }
		)
		issues = [];	
		out.write(`\n# ${tagMatch[1]}\n`);
	
	} else {		
		const er = /#(\d+)/g;
		while (issueMatch = er.exec(line)) {
            const issue = issueMatch[1];
			if (issues.findIndex(item => item == issue) == -1)	{
				issues.push(issue);
			}
		}
	}

});

issues.sort((a,b) => +a - +b).forEach(
	s => out.write(`- ${gitIssuesUrl}/${s}\n`)
)
