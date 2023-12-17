const express = require("express");
const {
  listContacts,
  addContact,
  removeContact,
  getContactById,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");
const { createContactValidator } = require("../../validator/validation");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();

    res.json(contacts);
  } catch (error) {
    res.send(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    res.json(contact);
  } catch (error) {
    res.status(404).json({ error: `Contact doesn't exist` });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { value, error } = createContactValidator(req.body);

    if (error) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const newContact = await addContact(value);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: "missing required name field" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    await removeContact(contactId);
    res.status(200).json({
      message: `Contact with ID: ${contactId} was successfully deleted`,
    });
  } catch (error) {
    res.status(404).json({ error: `Contact doesn't exist` });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { value, error } = createContactValidator(req.body);

    if (error) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const updatedContact = await updateContact(contactId, value);

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const { favorite } = req.body;

    const updatedContact = await updateStatusContact(contactId, { favorite });

    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
