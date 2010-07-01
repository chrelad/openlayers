# OpenLayers 3

This document describes the process of cloning the central OpenLayers repository
and making changes to it. It is really only relevant to developers who are
currently core committers to the OpenLayers subversion repository. If you are
interested in contributing to the future of OpenLayers, please fork the
[central repository][1], make changes, and issue pull requests. We welcome your
contributions and appreciate the help!

This document doesn't cover the git basics. The [help pages][2] on GitHub are a
good place to start learning git.

There two types of changes developers will be making to the central OpenLayers
repository. The first type will be commits that add features toward the
OpenLayers v3 API or remove parts of the v2 API. The second type of change
will be merges that come from the remote [OpenLayers subversion][3] repository.

[1]: http://github.com/openlayers/openlayers
[2]: http://help.github.com/
[3]: http://svn.openlayers.org/trunk/openlayers


## Pushing Commits to the Central Repository

To make changes to the central git repository, you can fork it, add a reference
(perhaps named "central" or "upstream") to the central repository, and push
commits directly from your working copy.  In addition, you can clone the central
repository and push commits back to the "origin."  The second process is 
described below.

First, clone the central repo:

    git clone git@github.com:openlayers/openlayers.git ol3

Now you can make changes, commit often, and push commits:

    cd ol3
    hack hack hack
    git commit -m "Making things awesome."
    hack hack hack
    git commit -m "Making things awesomer."
    git push origin master


## Merging Changes from the Remote Subversion Repository

This section describes how to fetch changes from the OpenLayers subversion 
repository, merge those into the master git branch, and push them to the 
central repository on GitHub.  The purpose for doing this is to bring changes
from the 2.x line of development into the 3.x line of development.  Not 
everybody will have to do this.  And it should be done with caution.  As the 
version 3 API changes from the v2 API, there will be increasing conflicts in the
merges.

### Configuring your git repository to know about svn

First, check out (and change into) the 2.x branch if you haven't already.  From
within your ol3 git repository, run the following:

    git checkout -b 2.x origin/2.x

The next thing you need to do to be able to merge in changes from subversion
is to configure your working copy of the central git repository to know about 
the remote svn.

    git svn init http://svn.openlayers.org/trunk/openlayers
    git config svn.authorsfile authors.txt

Note: The authors file links authors in subversion commits to GitHub users. The
user names and emails in the authors file correspond to GitHub usernames and
emails. Don't change this file unless you are correcting a GitHub user's
information or adding a new author from the subversion log.

Finally, you need to configure your repo so it knows about the latest commit 
that the remote git-svn refers to.  To do this, run the following:

    git show origin/2.x | head -n 1 | sed 's/commit //' > .git/refs/remotes/git-svn

At this point, your local git repository should be configured to fetch changes
from the remote OpenLayers subversion repository.  Changes from this repository
could be fetched (and applied to) any branch in your git repository, but by 
convention, we'll only apply changes from the SVN repository to the 2.x branch.
Commits to the 2.x branch (which should only come from SVN) can be merged to 
your master branch (or any other) and then pushed to the central repository.

To confirm that your repository is correctly configured, run the following:

    git svn info

You should see something like what you'd expect from `svn info` inside a 
working copy of a subversion repository.  The first time you run it, you'll get
a lot of extra output about rebuilding the revision map.

### Fetching changes from svn

As mentioned above, you can fetch changes into any of your git branches, but
by convention, we only apply changes from the subversion repository to the 2.x
branch.

If you haven't already, change into your 2.x branch (always run `git branch` 
before fetching or making changes to confirm what branch you are on) and pull
the latest changes:

    git checkout 2.x
    git pull origin 2.x

We expect all the changes in this branch to come from subversion - so you should
never make commits (with `git commit`) directly to this branch.  Instead, we
always fetch changes from the remote subversion repository.  Run the following 
to fetch changes and apply them as commits to your 2.x branch.

    git svn fetch

At this point, you can push the commits from your local 2.x branch (the changes 
that came from svn) to the central git repo:

    git push origin 2.x

### Merging changes from the 2.x branch

As with any other branch, changes from the 2.x branch can be merged into your
master branch.  As the OpenLayers v3 API diverges from the v2 API, these merges
will likely come with a number of conflicts.  Resolve these conflicts with care.

To merge changes (without conflict resolution), change to your master branch,
pull the latest from the central repository, and merge changes from your 2.x
branch.

    git checkout master
    git pull origin master
    git merge 2.x

If all goes well, you can push the merged commits to the central repository:

    git push origin master


#### Notes for Posterity

If GitHub burns down and everybody with a clone quits their job and goes 
surfing, the git repository can be recreated with something like the following
steps (the second one takes a long time to run, so I'm not going to 
reproduce it to confirm):

First, create an authors.txt file from an updated working copy of the svn repo:

    #!/usr/bin/env bash
    authors=$(svn log -q | grep -e '^r' | awk 'BEGIN { FS = "|" } ; { print $2 }' | sort | uniq)
    for author in ${authors}; do
      echo "${author} = NAME <USER@DOMAIN>";
    done

Run this and save the output as authors.txt.  Credits to [Josh Nichols][technicalpickles] 
for the script.  Edit this authors file to correct any GitHub user names or 
email addresses.

Next, run the following (and substitute the path to the above mentioned 
authors.txt):

    git svn clone -A path/to/authors.txt http://svn.layers.org/trunk/openlayers ol3
    cd ol3
    git remote add origin git@github.com:openlayers/openlayers.git
    git checkout -b 2.x git-svn
    git push -all origin
    cp path/to/authors.txt .
    git commit -am "Adding authors file."
    git push origin 2.x
    git checkout master
    git merge 2.x
    git push origin master


[technicalpickles]:http://technicalpickles.com/posts/creating-a-svn-authorsfile-when-migrating-from-subversion-to-git/
