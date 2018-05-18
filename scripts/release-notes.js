var newVersion = require('../package.json').version;
process.exit(1);

var fs = require('fs');
var inputFileName = process.argv[2];
var outputFileName = 'release-notes.md';

var out = fs.createWriteStream(outputFileName);

let issues = [];

fs.readFileSync(inputFileName).toString().split('\n').forEach(function (line) { 
	// console.log('line', line);

    const er = /\(.*tag: v([\d\.\-a-z]+)/g;
	const tagMatch = er.exec(line);
	
	if (tagMatch) {
		issues.sort((a,b) => +a - +b).forEach(
			item => {
                // curl -k --header "Private-Token: sm_C1qjuSEH7vtiAwfyy" https://git.serpro/api/v4/projects/dedat%2Fdeat3%2Fngx-suite-rfb/issues/101
                out.write(`- https://git.serpro/dedat/deat3/ngx-suite-rfb/issues/${item}\n`)
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
	s => out.write(`- https://git.serpro/dedat/deat3/ngx-suite-rfb/issues/${s}\n`)
)
