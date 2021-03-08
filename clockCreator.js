let clocksettings = {
  background: 220,
  framerate: 30,
  size: 400,
  padding: 10,
  secminmark: 5,
  hourmark: 10,
  hoursize: 30,
  timefontsize: 30,
  hourfontsize: 30,
  hourpoint: 130,
  hourcolor: [255, 0, 0],
  minpoint: 150,
  mincolor: [0, 0, 255],
  secpoint: 160,
  seccolor: [0, 255, 0],
};

let clockCreator = (settings) => {
  let cp = settings.size / 2;
  let pad = (x) => {
    return ('00' + Math.floor(x)).substr(-2);
  };
  let get_theta = (p, n, base) => {
    return (n*360/base-90) *p.PI/180;
  };
  
  let draw_background = (p) => {
    let cs = settings.size - settings.padding * 2; // cs: circle size
    let hcs = cs / 2; // half circle size
    p.stroke(0);
    p.background(settings.background);
    p.ellipse(cp, cp, cs, cs);
  
    for (let i=0; i<60; ++i) {
      let theta = get_theta(p, i, 60);
      let x = p.cos(theta);
      let y = p.sin(theta);
      if (i % 5 != 0) {
        p.line(hcs*x + cp, hcs*y + cp, 
             (hcs-settings.secminmark)*x + cp, 
            (hcs-settings.secminmark)*y+cp);
      } else {
        let x2 = (hcs-settings.hourmark)*x + cp;
        let y2 = (hcs-settings.hourmark)*y + cp;
        p.line(hcs*x + cp, hcs*y + cp, x2, y2);

        let j = (i/5 + 11)%12+1; // convert to 1-12
        p.textSize(settings.hourfontsize);
        p.textAlign(p.CENTER, p.CENTER);
        let textdist = hcs-settings.hourmark-
            settings.hourfontsize/2;
        p.text(j, textdist*x + cp, textdist*y+cp);
      }
    }
  };
  let line_time = (p, n, base, length, thecolor) => {
    let theta = get_theta(p, n, base);
    let x = length * p.cos(theta);
    let y = length * p.sin(theta);

    p.stroke(p.color(thecolor));
    p.strokeWeight(3);
    p.line(200, 200, 200+x, 200+y);
    p.strokeWeight(1);
  }
  let draw_current_time = (p, hh, mm, ss) => {
    let current = pad(hh) + ':' + pad(mm) + ':' + pad(ss);
    p.textSize(30);
    p.textAlign(p.CENTER, p.CENTER);
    let theta = get_theta(p, ss, 60);
    let x = 80*p.cos(theta) + 200;
    let y = 80*p.sin(theta) + 200;
    p.translate(x, y);
    p.text(current, 0, 0);
  }
  
  return p => {
    p.setup = () => {
      p.createCanvas(settings.size, settings.size);
      p.frameRate(settings.framerate);
    };
    p.draw = () => {
      let dd = new Date();
      let tt = (dd.getTime() / 1000) % 86400 - 
          dd.getTimezoneOffset() * 60;
      let hh = tt / (60*60);
      let mm = (tt / 60) % 60;
      let ss = tt % 60;

      draw_background(p);
      line_time(p, hh, 12, settings.hourpoint,
                settings.hourcolor);
      line_time(p, mm, 60, settings.minpoint,
                settings.mincolor);
      line_time(p, ss, 60, settings.secpoint,
                settings.seccolor);
      draw_current_time(p, hh, mm, ss);
    }
  };
};

let myclock = clockCreator(clocksettings);
new p5(myclock);
new p5(myclock);
