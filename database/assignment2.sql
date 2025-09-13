-- Data for table `account`
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES ('Tony','Stark','tony@starkent.com','Iam1ronM@n');

--Updating account_type from the table `account`
UPDATE public.account 
SET account_type = 'Admin'
WHERE account_lastname = 'Stark' AND account_firstname = 'Tony';

--Delete Tony Stark record from the table `account`
DELETE FROM public.account 
WHERE account_lastname = 'Stark' AND account_firstname = 'Tony';

--Replacing data from the table `inventory` (query 4)
UPDATE public.inventory 
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--Select data from the table `inventory` and `classification`
SELECT inv_make, inv_model, classification_name
FROM public.inventory inv
INNER JOIN public.classification clas
ON inv.classification_id = clas.classification_id 
WHERE classification_name = 'Sport';

--Adding data from the table `inventory` (query 6)
UPDATE public.inventory 
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');
  
