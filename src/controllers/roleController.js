const Permission = require("../db/models/Permission");
const Role = require("../db/models/Role");

const roleController = {
  getPermission: async (req, res) => {
    try {
      const permissions = await Permission.find();
      res.status(200).send({ permissions });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  createPermission: async (req, res) => {
    try {
      const newPermission = new Permission(req.body);
      await newPermission.save();

      res.status(200).send({ newPermission });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  getRole: async (req, res) => {
    try {
      const roles = await Role.find();
      res.status(200).send({ roles });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  createRole: async (req, res) => {
    try {
      const newRole = new Role(req.body);
      await newRole.save();

      res.status(200).send({ newRole });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  givePermissionForRole: async (req, res) => {
    try {
      const role = await Role.findById(req.params.id);

      const findPermission = role.permissionIds.includes(req.body.permissionId);

      if (findPermission) {
        await Role.updateOne(
          { _id: req.params.id },
          { $pull: { permissionIds: req.body.permissionId } }
        );
      } else {
        role.permissionIds.push(req.body.permissionId);
        await role.save();
      }

      res.status(200).send({ message: "Change permission successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = roleController;
