from fabric.api import run, env, cd

env.hosts = ['xn--zbv.tokyo']
env.user = 'deploy-user'
env.port = '10022'
env.key_filename = '~/.ssh/deploy'

def deploy():
    code = '/web/httpd_arata/dark-bot'
    with cd(code):
        run('git pull origin master')
        run('make -C /web/httpd_arata/dark-bot install')
        run('make -C /web/httpd_arata/dark-bot lint')
        run('make -C /web/httpd_arata/dark-bot test')
    run('/usr/local/bin/supervisorctl reload dark')
    print("Done")
