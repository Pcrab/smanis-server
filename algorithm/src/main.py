import os.path
import shutil

import numpy as np
import cv2
from websocket_server import WebsocketServer
import logging
import base64
import threading

START = True


def new_client(client, server):
    print("New client connected and was given id %d" % client['id'])
    server.send_message_to_all("Hey all, a new client has joined us")


def client_left(client, server):
    global START
    START = True
    print("Client(%d) disconnected" % client['id'])


def start_video(n):
    threading.Thread(target=video_thread, args=(n,)).start()
    print('start thread')


def stop_video():
    global START
    START = False


def video_thread(n):
    global START, server
    id = n
    video = 0
    short = False
    high = 10
    low = 8
    imgName = "./cv/changdi.JPG"
    fps = 20
    scoreFrame = []
    basePath = "./cv/videos/"
    path = basePath + "{}/".format(id)
    if not os.path.exists(basePath):
        os.mkdir(basePath)
    if os.path.exists(path):
        shutil.rmtree(path)
    os.mkdir(path)

    zoom = [
        # 名称 范围
        ("./cv/video/test.mp4",
         np.array([[393, 290], [577, 179], [331, 171], [24, 241]]),
         [[393, 290], [520, 215], [200, 200], [24, 241]],
         ),
        ("./cv/video/test3.mp4",
         np.array([[365, 345], [630, 223], [320, 198], [0, 246], [0, 280]]),
         [[365, 345], [545, 265], [150, 225], [0, 246], [0, 280]],
         ),
        ("./cv/video/test4.mp4",
         np.array([[310, 336], [639, 238], [638, 225],
                  [362, 190], [0, 227], [0, 253]]),
         [[310, 336], [550, 264], [170, 208], [0, 227], [0, 253]],
         ),
    ]
    cap = cv2.VideoCapture(zoom[video][0])  # 参数为0是打开摄像头，文件名是打开视频
    fgbg = cv2.createBackgroundSubtractorMOG2()  # 混合高斯背景建模算法

    fourcc = cv2.VideoWriter_fourcc('H', '2', '6', '4')
    out1 = cv2.VideoWriter(path + "output1.mp4", fourcc,
                           20.0, (640, 480))  # 分辨率要和原视频对应
    out2 = cv2.VideoWriter(path + "output2.mp4", fourcc,
                           20.0, (640, 480))  # 分辨率要和原视频对应

    point = 0
    oldPosition = []
    oldK = 0
    frameNum = 1
    previousYes = -float("inf")  # inf正无穷
    transform = np.float32([[82, 118], [82, 0], [0, 0], [0, 118]])
    dst = cv2.imread(imgName)
    print("Ready to start loop...")
    while START:
        print("Inside the loop...")
        ret, img = cap.read()  # 读取图片
        if not ret:
            break
        frameNum += 1
        pts = np.array([zoom[video][1]])
        # 和原始图像一样大小的0矩阵，作为mask
        mask = np.zeros(img.shape[:2], np.uint8)  # 取彩色图片的长、宽
        # 在mask上将多边形区域填充为白色
        cv2.polylines(mask, pts, 1, 255)  # 描绘边缘
        cv2.fillPoly(mask, pts, 255)  # 填充
        # 逐位与，得到裁剪后图像，此时是黑色背景
        frame = cv2.bitwise_and(img, img, mask=mask)
        fgmask = fgbg.apply(frame)

        element = cv2.getStructuringElement(cv2.MORPH_CROSS, (3, 3))  # 形态学去噪
        fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_OPEN, element)  # 开运算去噪

        contours, hierarchy = cv2.findContours(
            fgmask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)  # 寻找前景

        realContours = []
        for cont in contours:
            Area = cv2.contourArea(cont)  # 计算轮廓面积
            if Area < 1 or Area > 100:  # 过滤面积小于10的形状
                continue
            realContours.append(cont)
        if len(realContours) == 0:
            oldPosition = []
            if short:
                continue
        else:
            rect = cv2.boundingRect(realContours[0])  # 提取矩形坐标
            position = np.array([rect[0] + rect[2] / 2, rect[1] + rect[3] / 2])
            # print("point: x: {}, y: {}".format(position[0], position[1]))

            cv2.rectangle(frame, (rect[0], rect[1]), (rect[0] + rect[2], rect[1] + rect[3]), (0, 205, 205),
                          1)  # 原图上绘制矩形
            cv2.rectangle(fgmask, (rect[0], rect[1]), (rect[0] + rect[2], rect[1] + rect[3]), (0xff, 0xff, 0xff),
                          1)  # 黑白前景上绘制矩形
            M = cv2.getPerspectiveTransform(
                zoom[video][1].astype(np.float32), transform)
            if len(oldPosition) != 0:
                k = (oldPosition[0] - position[0]) * \
                    (oldPosition[1] - position[1])
                # print("no, oldPosition: {}, position: {}, k: {}, k1: {}".format(oldPosition, position, k, k1))
                if k > 0 and oldK < 0:
                    # 大概 50 帧左右即可
                    # print("maybe, oldPosition: {}, position: {}, oldK: {}, k: {}".format(oldPosition, position, oldK, k))
                    # print("frameNum: {}".format(frameNum))
                    if frameNum - previousYes > 50:
                        # print("yes, oldPosition: {}, position: {}, oldK: {}, k: {}".format(oldPosition, position, oldK,
                        #                                                                    k))
                        if cv2.pointPolygonTest(np.array(zoom[video][2]), position, False) == 1.0:
                            point += high
                        else:
                            point += low
                        server.send_message_to_all(str(point))
                        print("point: {}".format(point))
                        previousYes = frameNum
                        # draw
                        rows, cols, channels = frame.shape
                        homg_point = [position[0], position[1], 1]
                        transf_homg_point = M.dot(homg_point)
                        transf_homg_point /= transf_homg_point[2]
                        transf_point = transf_homg_point[:2]
                        dst = cv2.imread(imgName)
                        cv2.circle(dst, (int(transf_point[0]), int(
                            transf_point[1])), 2, (0, 0, 255), -1)
                        scoreFrame.append(frameNum)
                oldK = k
            oldPosition = position

        b = np.array([pts], dtype=np.int32)
        cv2.bitwise_not(img, img, mask=mask)
        cv2.fillPoly(img, b, 0)
        # cv2.imshow('frame', frame)  # 在原图上标注
        # cv2.imshow('frame2', img + frame)  # 以黑白的形式显示前景和背景
        img = (img + frame)
        img[0:144, 0:100] = dst
        # cv2.imshow('result', img)
        print("send")
        if len(server.clients) > 0:
            image = cv2.imencode('.jpg', img)[1]
            base64_data = base64.b64encode(image)
            s = base64_data.decode()
            server.send_message_to_all(s)
        out1.write(frame)
        out2.write(img)

    print("STOPPED!!!")
    # print("final point: {}".format(point))
    out1.release()  # 释放文件
    out2.release()  # 释放文件
    cap.release()
    cv2.destroyAllWindows()
    # print("writing...")
    for frame in scoreFrame:
        cap = cv2.VideoCapture(path + "output2.mp4")
        start = frame - fps * 2
        end = frame + fps * 2
        out = cv2.VideoWriter(path + "output-{}.mp4".format(frame), fourcc, 20.0,
                              (640, 480))  # 分辨率要和原视频对应
        if start < 0:
            start = 0
        cap.set(cv2.CAP_PROP_POS_FRAMES, start)
        if end > cap.get(7):
            end = int(cap.get(7))
        for point in range(start, end):
            ret, img = cap.read()
            if not ret:
                break
            out.write(img)
        out.release()


def message_received(client, server, message):
    global START
    if message == "stop":
        print("stop!")
        stop_video()
    else:
        print("start!")
        START = True
        start_video(message)


PORT = 4200
server = WebsocketServer(
    port=PORT, loglevel=logging.INFO)  # 创建Websocket Server
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()
