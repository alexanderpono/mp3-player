# mp3-player
An application with simple UI in browser to playback music from an external USB drive

System requirements:
* Linux and Windows 7+
* Node.js 12 installed

To configure the apllication:
1. Clone repository
```
git clone git@github.com:alexanderpono/mp3-player.git
```

2. Install dependencies for backend part of the application
```
cd mp3-player/mp3-player-back
npm i
cd ../..
```

3. Install dependencies for UI part of the application
```
cd mp3-player/mp3-player-ui
npm i
cd ../..
```

4. Create config file for your OS from template

Windows:
```
cd mp3-player\mp3-player-config
copy const-example-win.ts const.ts
cd ../..
```

Linux:
```
cd mp3-player/mp3-player-config
cp const-example-linux.ts const.ts
cd ../..
```

5. Edit config file const.ts for your configuration

```
cd mp3-player/mp3-player-config
<edit> const.ts
```

6. Start backend of the application
```
cd mp3-player/mp3-player-back
npm run back
```

7. Start UI of the application
```
cd mp3-player/mp3-player-ui
npm run ui
```

8. Enjoy!

8.1. Incert a USB drive into USB port. Application is to autiomatically show the list of mp3 files from the root of inserted USB drive

8.2. Select a file to play

8.3. Press "Воспроизвести". The playback is to start

8.4. Press "Извлечь" to safely eject the USB drive