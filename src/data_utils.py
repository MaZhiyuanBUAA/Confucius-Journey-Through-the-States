# coding:utf-8

import pydub
import numpy as np
#读取mp3
audiofile = pydub.AudioSegment.from_mp3('../data/poker_face_for_all.mp3')
#转换成数字矩阵
data = np.fromstring(audiofile._data, np.int16)
print(len(data),sum(data),audiofile.channels)
#按声道分开
channels = []
for chn in range(audiofile.channels):
    channels.append(data[chn::audiofile.channels])

print(len(channels))