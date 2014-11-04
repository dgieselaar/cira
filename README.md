cira is a command line tool to interact with JIRA. It relies on [steves' node-jira](https://github.com/steves/node-jira). It supports the following commands: 

- `config`
- `sprint`
- `search`
- `issue`

### config

cira needs a couple of values from you to succesfully interact with JIRA's api. These are:

- `username`: Your Atlassian username.
- `password`: The password associated with this username.
- `host`: The URL where your JIRA instance is hosted. If you leave out the protocol, it defaults to _https_. You can add the port here as well.
- `version`: The API version of your JIRA instance. Defaults to _2_. _(Optional)_
- `project`: The key of your default project. You can always override this by running your commands with --project=XX. _(Optional)_

`config` is a wizard for supplying these values. They are stored in `./.cira`. If you're running a command without a valid configuration, the wizard will run first.

### sprint

Commands related to sprints. If empty, it defaults to `show`.

- `list`: List all issues in the open sprints.
	- `-m, --mine`: Only your issues
	- `-o, --open`: Only open (ie not resolved) issues
	- `-s, --sort`: A comma-separated list of fields to sort on (eg `--sort=key`)
	- `-r, --reverse`: Reverse the sort order (only works if `sort` is set)

- `add`: Add an issue (or more) to the first open sprint. Separate issues with commas, eg `cira sprint add 123 124 125`
- `remove`: Remove an issue from the sprint it's in. Use it like `add`.


### issue

Issue commands. If empty, it defaults to `show`. For every command, you can supply a comma-separated list of issue IDs, eg `cira issue 123 124 125`.

- `show`: Show detailed issue views, including comments.


_Everything below is a work in progress_.

general options:

--fields
- define which fields should be displayed

--project
- set project prefix (otherwise, default is used)


cira search
- search for issues. use jql with -j or use free text search

cira issue [ ... ]
- display specified issues

cira issue transition [ ... ] 
- move specified issues into next phase of workflow 
cira issue resolve
cira issue accept
cira issue start
cira issue stop
cira issue 


cira update 		update isssues
cira list

-p --project: the project of the mentioned issues
