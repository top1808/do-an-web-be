const Permission = require("../models/Permission");
const Role = require("../models/Role");
const RolePermission = require("../models/RolePermission");
const User = require("../models/User");

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
      let roles = await Role.find();
      roles = await Promise.all(
        roles.map(async (role) => {
          const permissions = await RolePermission.find({ roleId: role._id });
          return {
            ...role.toObject(),
            permissionIds: permissions.map((p) => p.permissionId),
          };
        })
      );
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
      const role = await Role.findById(req.body.roleId);
      if (!role) return res.status(404).send({ message: "Role not found." });

      const permissionOfRole = await RolePermission.findOne({
        roleId: req.body.roleId,
        permissionId: req.body.permissionId,
      });

      if (!permissionOfRole) {
        const newRolePermission = new RolePermission(req.body);
        await newRolePermission.save();
      } else {
        await permissionOfRole.deleteOne();
      }

      res.status(200).send({ message: "Change permission successfully." });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  checkPermisson: async (req, res) => {
    try {
      const permissions = await Permission.find({ url: req.body.url });

      let canView = !permissions.find(p => p.method === "get");
      let canCreate = !permissions.find(p => p.method === "post");
      let canEdit = !permissions.find(p => p.method === "put");
      let canDelete = !permissions.find(p => p.method === "delete");

      const user = await User.findById(req.user.id);
      const userPermissions = await RolePermission.find({
        roleId: user.roleId,
      });

      for (const userPermission of userPermissions) {
        const findPermission = permissions.find(p => p._id.toString() === userPermission.permissionId.toString());
        if (findPermission) {
          switch (findPermission.method) {
            case "get": {
              canView = true;
              break;
            }
            case "post": {
              canCreate = true;
              break;
            }
            case "put": {
              canEdit = true;
              break;
            }
            case "delete": {
              canDelete = true;
              break;
            }
            default: break;
          }
        }
      }

      res
        .status(200)
        .send({
          url: req.body.url,
          canView: canView,
          canCreate: canCreate,
          canEdit: canEdit,
          canDelete: canDelete,
        });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = roleController;
