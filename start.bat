@echo off
title Dogie Bot
echo -----------------------
echo [CMD] Starting bot...
echo -----------------------
:main
node .
echo --------------------------------
echo [CMD] Bot crashed! Restarting..
echo --------------------------------
goto main