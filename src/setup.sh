# install python and ffmpeg
sudo apt install ffmpeg python3
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3

# download youtube-dl
sudo curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
sudo chmod a+rx /usr/local/bin/youtube-dl
