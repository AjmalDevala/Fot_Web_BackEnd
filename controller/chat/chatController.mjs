import userModel from "../../model/playerModel/userModel.mjs";

export const connectedScout = async (req, res ) => {
    try {
      const { userId } = res.decodedToken
      const connectedScout = await userModel.findById(userId).populate('connectedScout');
      res.status(200).json(connectedScout);
    } catch (error) {
      return res.status(500).json("Internal server error");
    }
  }