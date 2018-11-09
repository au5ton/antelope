from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
import whatapi
import os

what = whatapi.WhatAPI(username=os.environ["GAZELLE_USERNAME"], password=os.environ["GAZELLE_PASSWORD"], server=os.environ["GAZELLE_SITE"])

print(what.request("artist", id=1))