import { encode } from "js-base64";

const handler = async (req, res) => {
  const settings = JSON.stringify(req.body);
  return res.status(200).json({ encodedSettings: encode(settings) });
};

export default handler;
