const Contact = require("../models/contactsSchema");

const listContacts = async () => {
  try {
    const contacts = Contact.find();
    return contacts;
  } catch (error) {
    console.log("error: ", error);
  }
};

const getContactById = async (contactId) => {
  const contactExist = await Contact.findById(contactId);
  if (contactExist) {
    return contactExist;
  } else {
    throw new Error();
  }
};

const removeContact = async (contactId) => {
  await Contact.findByIdAndDelete({ _id: contactId });
};

const addContact = async (body) => {
  const createdContact = await Contact.create(body);
  return createdContact;
};

const updateContact = async (contactId, body) => {
  const contactExist = await Contact.findOneAndUpdate(
    { _id: contactId },
    body,
    { new: true }
  );

  if (!contactExist) {
    throw new Error();
  } else {
    return contactExist;
  }
};

const updateStatusContact = async (contactId, body) => {
  const contactExist = await Contact.findOneAndUpdate(
    { _id: contactId },
    body,
    { new: true }
  );

  if (!contactExist) {
    throw new Error();
  } else {
    return contactExist;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
