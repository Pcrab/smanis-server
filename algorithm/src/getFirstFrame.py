import cv2 as cv
import numpy as np
import base64
import os

cap = cv.VideoCapture("cv/video/test.mp4")
encode_param = [int(cv.IMWRITE_JPEG_QUALITY), 80]

ret, img = cap.read()
cv.imwrite("cv/video/first.jpg", img)
cap.release()
