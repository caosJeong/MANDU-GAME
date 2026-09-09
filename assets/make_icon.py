"""앱 로고(600x600 PNG)를 그려요 — 고양이 귀 달린 만두.

PIL 없이 표준 라이브러리만 씁니다. 도형을 SDF(부호 있는 거리장)로 정의하고
합집합(min)을 취해 내부 경계선 없이 외곽선 하나만 두르는 방식이에요.
색·주름 개수·표정 위치만 바꾸면 그대로 재생성됩니다.
"""

import zlib, struct, math

S = 600
BG     = (0xB0, 0x68, 0xCC)   # 원작 고향만두 게임 배경 보라
FILL   = (0xFF, 0xF6, 0xE4)
STROKE = (0x52, 0x20, 0x30)   # 원작의 진한 갈색 계열 외곽선
BLUSH  = (0xF6, 0x9B, 0x8C)
STROKE_W = 11.0

CX = 300.0
Y0 = 215.0                        # 주름·귀가 앉는 선
BELLY = (CX, 275.0, 196.0, 180.0) # cx, cy, rx, ry — 통통한 몸통
PLEATS = [(CX + k * 76.0, Y0, 44.0) for k in (-1, 0, 1)]

# 뚱냥이 귀 — 짧고 둥글넓적하게.
# 다각형 SDF 에서 EAR_R 을 빼면 모서리가 둥글어져요(안쪽으로 줄여 잡고 다시 부풀리는 셈).
# 아랫변은 몸통 깊숙이 박아야 이음매에 외곽선이 새지 않아요.
EAR_R = 26.0
EARS = [
    [(162.0, 171.0), (136.0, 219.0), (172.0, 285.0), (206.0, 219.0)],
    [(438.0, 171.0), (464.0, 219.0), (428.0, 285.0), (394.0, 219.0)],
]

EYES = [(248.0, 300.0, 18.0), (352.0, 300.0, 18.0)]
BLUSHES = [(190.0, 352.0, 34.0), (410.0, 352.0, 34.0)]
MOUTH = [(282.0, 346.0, 22.0), (318.0, 346.0, 22.0)]  # ω
MOUTH_W = 6.0


def sdf_ellipse(x, y, cx, cy, rx, ry):
    dx, dy = (x - cx) / rx, (y - cy) / ry
    return (math.hypot(dx, dy) - 1.0) * min(rx, ry)


def sdf_triangle(x, y, tri):
    """볼록 다각형의 부호 거리.

    안쪽은 세 변의 부호거리 중 최댓값이면 충분하지만, 바깥쪽은 그 값이
    '가장 가까운 변이 놓인 직선까지의 거리'라 모서리 근처에서 실제보다 작게 나와요.
    그대로 반지름을 빼면 모서리가 각진 채로 부풀기만 해서, 바깥은 선분까지의
    실제 거리를 씁니다 — 이래야 EAR_R 을 뺐을 때 모서리가 둥글어져요.
    """
    n = len(tri)
    inside = -1e9
    nearest = 1e9
    for i in range(n):
        ax, ay = tri[i]
        bx, by = tri[(i + 1) % n]
        ex, ey = bx - ax, by - ay
        length = math.hypot(ex, ey)
        nx, ny = ey / length, -ex / length
        inside = max(inside, (x - ax) * nx + (y - ay) * ny)
        t = max(0.0, min(1.0, ((x - ax) * ex + (y - ay) * ey) / (length * length)))
        nearest = min(nearest, math.hypot(x - (ax + ex * t), y - (ay + ey * t)))
    return nearest if inside > 0 else inside


def orient(tri):
    """무게중심이 내부(음수)가 되도록 정점 순서를 맞춰요."""
    gx = sum(p[0] for p in tri) / len(tri)
    gy = sum(p[1] for p in tri) / len(tri)
    return tri if sdf_triangle(gx, gy, tri) < 0 else tri[::-1]


EARS = [orient(t) for t in EARS]


def sdf_body(x, y):
    """만두 몸통 = 반타원 ∪ 주름 원들 ∪ 귀 삼각형들."""
    cx, cy, rx, ry = BELLY
    d = max(sdf_ellipse(x, y, cx, cy, rx, ry), Y0 - y)
    for px, py, pr in PLEATS:
        d = min(d, math.hypot(x - px, y - py) - pr)
    for tri in EARS:
        d = min(d, sdf_triangle(x, y, tri) - EAR_R)
    return d


def sdf_face(x, y):
    """표정 = 눈 ∪ 입 아치. 몸통 안쪽에 STROKE 색으로 얹어요."""
    d = 1e9
    for ex, ey, er in EYES:
        d = min(d, math.hypot(x - ex, y - ey) - er)
    for mx, my, mr in MOUTH:
        # 아래쪽 반원만 남긴 링 → ω 모양
        ring = abs(math.hypot(x - mx, y - my) - mr) - MOUTH_W
        d = min(d, max(ring, my - y))
    return d


def sdf_blush(x, y):
    d = 1e9
    for bx, by, br in BLUSHES:
        d = min(d, math.hypot(x - bx, y - by) - br)
    return d


def cov(d):
    return min(max(0.5 - d, 0.0), 1.0)


def mix(a, b, t):
    if t <= 0.0:
        return a
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


rows = []
for py in range(S):
    row = bytearray([0])
    y = py + 0.5
    for px in range(S):
        x = px + 0.5
        d = sdf_body(x, y)
        c = mix(BG, STROKE, cov(d))              # 외곽선
        c = mix(c, FILL, cov(d + STROKE_W))      # 안쪽 면
        c = mix(c, BLUSH, cov(sdf_blush(x, y)) * 0.75 * cov(d + STROKE_W))
        c = mix(c, STROKE, cov(sdf_face(x, y)))  # 표정
        row += bytes(c)
    rows.append(bytes(row))

raw = b"".join(rows)


def chunk(tag, data):
    return (struct.pack(">I", len(data)) + tag + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))


png = (b"\x89PNG\r\n\x1a\n"
       + chunk(b"IHDR", struct.pack(">IIBBBBB", S, S, 8, 2, 0, 0, 0))
       + chunk(b"IDAT", zlib.compress(raw, 9))
       + chunk(b"IEND", b""))

import sys
out = sys.argv[1] if len(sys.argv) > 1 else "assets/icon-600.png"
open(out, "wb").write(png)
print(out, len(png), "bytes")
