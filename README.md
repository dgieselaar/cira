cira config

- configure cira. if no arguments are given, the user is prompted to fill in all required configurable values. you can directly set values with --key=value.

general options:

--fields
- define which fields should be displayed

--format
- define how the issues should be displayed

--project
- set project prefix (otherwise, default is used)


cira sprint
- commands for listing and managing issues in sprints. by default, lists all issues in sprint

cira sprint active
- show active sprint

cira sprint mine
- list your issues in active sprint

cira sprint add [ ... ]
- add specified issues to active sprint

cira sprint remove [ ... ]
- remove specified issues from active sprint 

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
