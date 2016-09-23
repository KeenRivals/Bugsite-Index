from subprocess import call


#wget --mirror --convert-links --backup-converted --adjust-extension
options = ['--mirror', '--convert-links', '--backup-converted', '--adjust-extension']
urls = []
with open('./urls.txt') as infile:
    urls = infile.readlines()

for url in urls:
    call(['wget', *options, url.strip()])

