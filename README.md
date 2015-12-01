# Dark

[![Build Status](https://travis-ci.org/ngineerxiv/dark-bot.svg)](https://travis-ci.org/ngineerxiv/dark-bot)
[![Dependency Status](https://gemnasium.com/ngineerxiv/dark-bot.svg)](https://gemnasium.com/ngineerxiv/dark-bot)

This is Dark Bot

# What is Dark?

Dark is [Dark](https://ngineerxiv.doorkeeper.jp/)

# Dependencies

* node.js 
* Redis (for brain)

# Install

```
make install
```

# How to Run

```
# for local
make start-local

# for slack
make start credential=${credential path. see ./credentials/sample}
```

# Test

```
make test

# if you want test runner
make test-watch
```

