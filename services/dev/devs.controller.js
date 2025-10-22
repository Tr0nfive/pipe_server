import Devs from "./devs.model.js";

export async function getDev(req,res){
let {id} = req.params
if(!id)
    return res.status(404).json({message:"didnt get dev id"})
let dev = await Devs.getDevByID(id)
if(!dev)
    return res.status(400).json({message:"didnt find dev info"},dev)
return res.status(200).json({message:"found dev",dev})
}

export async function createDev(req, res) {
    try {
      const { name, email, password } = req.body || {};
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'missing info' });
      }
  
      const dev = new Devs(name, email, password);
      console.log('[CTRL] createDev ->', { name: dev.name, email: dev.email });
  
      const result = await dev.createDeveloper(); // InsertOneResult
      if (!result?.acknowledged) {
        return res.status(500).json({ message: 'insert not acknowledged' });
      }
      return res.status(201).json({ message: 'created dev', id: result.insertedId, name: dev.name, email: dev.email, role: dev.role });
    } catch (err) {
      if (err?.code === 11000) return res.status(409).json({ message: 'duplicate email/username' });
      console.error('[CTRL] createDev error', err);
      return res.status(500).json({ message: 'server error' });
    }
  }



  export async function addGameDevToStore(req,res){
    try {
      const {id} = req.params;
      const payload = req.body;
  
      console.log('[CTRL] BODY:', payload);
      console.log('[CTRL] PARAM devId:', id);
  
      if (!payload || Object.keys(payload).length === 0) {
        return res.status(400).json({ ok: false, message: 'Empty payload' });
      }
  
      // >>> THIS IS THE CRITICAL CALL <<<
      const result = await Devs.addGameDevToStore(id, payload);
  
      return res.status(200).json({ ok: true, ...result });
    } catch (err) {
      console.error('[CTRL] addGameDevToStore error:', err);
      return res.status(500).json({ ok: false, message: err.message || 'Server error' });
    }
}