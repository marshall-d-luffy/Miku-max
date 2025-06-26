const { createCanvas } = require('canvas');
module.exports = {
    config: {
        name: "analytics",
        version: "1.0.0",
        category: "Info",
        role: 2,
        description: "for owner if bot ._.",
        countDown: 10,
        guid: "{pn}",
        author: "allou (:"
    },
    onStart: async({message, globalData}) => {
        const analytics = await globalData.get("analytics");
        const analyticsData = analytics.data;
        const data = Gay(analyticsData);
        Meow(data, message);
    }
};

function Gay(data) {
  const colors = ["green", "lightgreen", "yellow", "lightyellow", "red", "#FF0062"];
  const coded_by_allou_ur_uncle = Object.values(data).reduce((sum, value) => sum + value, 0);
  const alu = Object.entries(data)
    .sort(([, valueA], [, valueB]) => valueB - valueA)
    .slice(0, 6);
  const fuk_who_change_credits = alu.map(([label, value], index) => ({
    label,
    value,
    percentage: Math.floor((value / coded_by_allou_ur_uncle) * 100),
    color: colors[index] || "#80FF00"
  }));
  return fuk_who_change_credits;
}

function Meow(data, message) {
  const width = 640;
  const height = 320;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Bg
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // CT
  ctx.fillStyle = '#000';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('AnalyticsData - Users usage of bot cmds.', 20, 40);

  // DPTPC
  let startAngle = -Math.PI / 2;
  const centerX = 200;
  const centerY = 200;
  const radius = 100;

  data.forEach((item) => {
    const endAngle = startAngle + (item.percentage / 100) * 2 * Math.PI;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();

    startAngle = endAngle;
  });

  // DTCT
  /*
  ctx.fillStyle = '#000';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('33%', centerX, centerY - 10);
  ctx.font = 'bold 18px Arial';
  ctx.fillText('Lucentis', centerX, centerY + 20);
  */
  // DTL
  const legendX = 350;
  let legendY = 80;

  data.forEach((item) => {
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, legendY, 20, 20);

    // LT
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${item.label.split("-")[0]}`, legendX + 30, legendY + 15);

    // PAV
    ctx.fillText(`${item.percentage}%`, legendX + 150, legendY + 15);
    ctx.fillText(`${item.value}`, legendX + 200, legendY + 15);

    legendY += 40;
  });

  // SC
  const buffer = canvas.createPNGStream();
  buffer.path = "c.png";
  message.send({attachment:buffer});
}