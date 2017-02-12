from math import *

def pos(xi,yi,xvi,yvi,g,t):
    xvf = xvi
    yvf = yvi + g*t
    yf = yvi*t + (1/2)*(g)*(t**2)
    xf = xvi*t
      
def col(x1,y1,x1vi,y1vi,m1,x2,y2,x2vi,y2vi,m2):
    cang = degrees(atan((x1-x2)/(y1-y2)))
    x1vf = ((((x1vi**2+y1vi**2)**0.5)*cos(radians(90-2*cang))*(m1-m2)+2*m2*((x2vi**2+y2vi**2)**0.5)*cos(radians(degrees(atan(y2vi/x2vi))-cang)))*cos(radians(cang))/(m1+m2)) + ((x1vi**2+y1vi**2)**0.5)*sin(radians(radians(90-2*cang)))*cos(radians(cang)+pi/2)
    y1vf = ((((x1vi**2+y1vi**2)**0.5)*cos(radians(90-2*cang))*(m1-m2)+2*m2*((x2vi**2+y2vi**2)**0.5)*cos(degrees(radians(atan(y2vi/x2vi))-cang)))*sin(radians(cang))/(m1+m2)) + ((x1vi**2+y1vi**2)**0.5)*sin(radians(radians(90-2*cang)))*sin(radians(cang)+pi/2)
    
    
