from fabric.api import run, env, cd

env.hosts = ['xn--zbv.tokyo']
env.user = 'deploy-user'
env.port = '10022'
env.key_filename = '~/.ssh/deploy'

def deploy():
    code = '/web/httpd_arata/dark-bot'
    with cd(code):
        run('git pull origin master')
    run('service supervisord restart')
    print("Done")
