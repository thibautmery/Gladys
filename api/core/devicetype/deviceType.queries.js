
module.exports = {
  getDeviceType: `
    SELECT dt.id, dt.type, dt.unit, dt.min, dt.max, dt.device, d.service 
    FROM device d
    JOIN devicetype dt ON (d.id = dt.device)
    WHERE dt.id = ?;
  `,
  getAll: `
    SELECT dt.id, dt.type, dt.tag,  dt.unit, dt.min, dt.max, dt.device, d.service, r.name AS roomName, r.id as roomId 
    FROM device d
    JOIN devicetype dt ON (d.id = dt.device)
    JOIN room r ON (d.room = r.id);
  `
};