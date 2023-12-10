const uuid = require("uuid");

const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "/contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (error) {
    console.log(error);
  }
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index !== -1) {
    return contacts.filter((c) => c.id === contactId);
  } else {
    throw new Error();
  }
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((contact) => contact.id === contactId);

  if (idx !== -1) {
    contacts.splice(idx, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return { message: "Contact deleted" };
  } else {
    throw new Error();
  }
};

const addContact = async (body) => {
  const contacts = await listContacts();

  const newContact = { id: uuid.v4(), ...body };

  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((contact) => contact.id === contactId);
  if (idx !== -1) {
    Object.assign(contacts[idx], body);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return contacts[idx];
  } else {
    throw new Error();
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
