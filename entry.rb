#!/usr/bin/ruby

require 'json'
require 'gazelle'
require 'dotenv'
Dotenv.load('.env')
include RubyGazelle

GAZELLE_USERNAME = ENV['GAZELLE_USERNAME']
GAZELLE_PASSWORD = ENV['GAZELLE_PASSWORD']
GAZELLE_SITE = ENV['GAZELLE_SITE']
GAZELLE_USERS = JSON.parse(ENV['GAZELLE_USERS'].split(' ')[0])
puts GAZELLE_SITE

client = Gazelle.connect({site: GAZELLE_SITE, username: GAZELLE_USERNAME, password: GAZELLE_PASSWORD})
client.artist(234)
