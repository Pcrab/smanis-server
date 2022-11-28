import numpy as np  # 数组和矩阵运算
import cv2

scale = 10  # 规模
width = int(10 * scale)  # int格式转换
length = int(width * 1.44)
# 生成一个空灰度图像 三通道宽width高length   width行3列
ground = np.zeros((length, width, 3), np.uint8)
ptLeftTop = (0, 0)
ptRightBottom = (width, length)
point_color = (255, 255, 255)  # BGR
thickness = 2  # 厚度
lineType = 8  # 线型
cv2.rectangle(ground, ptLeftTop, ptRightBottom,
              point_color, thickness, lineType)
cv2.rectangle(ground, ptLeftTop, (int(width / 2),
                                  int(length / 1.84)), point_color, thickness, lineType)
cv2.rectangle(ground, (int(width / 2), 0),
              (width, int(length / 1.84)), point_color, thickness, lineType)
cv2.imwrite("changdi.jpg", ground)
cv2.imshow('AlanWang', ground)
cv2.waitKey(10000)  # 显示 10000 ms 即 10s 后消失
cv2.destroyAllWindows()
