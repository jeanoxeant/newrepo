// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Rout to deliver management view
router.get('/', invController.buildManagementView);
//router.use(["/add-classification", "/add-inventory", "/edit/:inventoryId", "/update"], utilities.checkAuthorizationManager);

// Route to build inventory by classification view
//router.get("/", utilities.checkAuthorizationManager ,utilities.handleErrors(invController.buildManagementView)); // Had to put checkAuthorizationManager here too. Didn't work above
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Classification management routes
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification)); // ...through the appropriate router, where server-side validation middleware is present,... 

// Inventory management routes
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory));

// Build edit/update inventory views
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory));
router.post("/update/", invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));
//router.post("/update/", utilities.handleErrors(invController.updateInventory));

/* ******************************
 * Check data and return errors or directed back to edit view.
 * ***************************** */
invValidate.checkUpdateData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;
    let classifications = await utilities.buildClassificationList(
      classification_id
    );
    let nav = await utilities.getNav();
    res.render("inventory/edit-inventory", { // Try again
      errors,
      title: "Edit Inventory",
      nav,
      classifications,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id
    });
    return;
  }
  next();
};

// Build delete inventory views
router.get("/delete/:inventoryId", utilities.handleErrors(invController.buildDeleteInventory));
//router.post("/delete/", invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.deleteInventory));

// AJAX inventory api call route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;