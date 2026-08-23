-- Seed current static OpenRoad inventory into Supabase.
-- Run after supabase/openroad_admin.sql.

with inserted as (
  insert into openroad_vehicles (stock_number, year, make, model, trim, body_type, mileage, price, transmission, fuel_type, description, status) values
  ('2022-hyundai-venue-sel-wagon-h4841ad', 2022, 'Hyundai', 'VENUE', 'SEL Wagon', 'sedan', 78463, 14729, 'Automatic', 'Gasoline', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2021-honda-odyssey-touring-van-h4294my', 2021, 'Honda', 'Odyssey', 'Touring Van', 'van', 205587, 16520, 'Automatic', 'Gasoline', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2020-jeep-gladiator-nm182378', 2020, 'JEEP', 'Gladiator', 'OVERLAND PICKUP 4D 5 FT', 'truck', 76891, 26995, 'AUTOMATIC', 'GASOLINE', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2019-honda-cr-v-nb603749', 2019, 'HONDA', 'CR-V', 'TOURING SPORT UTILITY 4D', 'suv', 114811, 18995, 'AUTOMATIC', 'GASOLINE', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2019-volkswagen-jetta-sel-sedan-v5943sf', 2019, 'Volkswagen', 'Jetta', 'SEL Sedan', 'sedan', 141381, 12250, 'Automatic', 'Gasoline', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2017-buick-envision-ab104807', 2017, 'BUICK', 'Envision', 'ESSENCE SPORT UTILITY 4D', 'suv', 115326, 11995, 'AUTOMATIC', 'GASOLINE', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2017-chevrolet-equinox-171494', 2017, 'CHEVROLET', 'Equinox', 'LT SPORT UTILITY 4D', 'suv', 144570, 8595, 'AUTOMATIC', 'GASOLINE', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2016-chevrolet-tahoe-nb332503', 2016, 'CHEVROLET', 'Tahoe', 'LTZ SPORT UTILITY 4D', 'suv', 146224, 19995, 'AUTOMATIC', 'GASOLINE', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2016-chevrolet-traverse-lt-suv-c2379my', 2016, 'Chevrolet', 'Traverse', 'LT SUV', 'suv', 229105, 6500, 'Automatic', 'Gasoline', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2016-ford-f-250-super-duty-xl-truck-f6783md', 2016, 'Ford', 'F-250', 'Super Duty XL Truck', 'truck', 183075, 27500, 'Automatic', 'Diesel', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2016-honda-pilot-ex-l-w-res-suv-h7615ad', 2016, 'Honda', 'Pilot', 'EX-L w/RES SUV', 'suv', 204091, 9500, 'Automatic', 'Gasoline', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2016-kia-sorento-nm051519', 2016, 'KIA', 'Sorento', 'EX SPORT UTILITY 4D', 'suv', 163651, 7995, 'AUTOMATIC', 'GASOLINE', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2015-audi-a3-2-0-premium-tdi-sedan-a6923mp', 2015, 'Audi', 'A3', '2.0 Premium TDI Sedan', 'sedan', 64628, 13999, '5 Speed Manual', 'Diesel', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2015-bmw-750i-xdrive-sedan-b5964my', 2015, 'BMW', '750i', 'xDrive Sedan', 'sedan', 89676, 18799, 'Automatic', 'Gasoline', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2015-ford-f-150-xl-truck-f5510md', 2015, 'Ford', 'F-150', 'XL Truck', 'truck', 38306, 19562, 'Automatic', 'Flex-fuel', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2015-ford-mustang-ks386551', 2015, 'FORD', 'Mustang', 'GT PREMIUM COUPE 2D', 'sedan', 44667, 28995, 'AUTOMATIC', 'GASOLINE', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2014-ford-f-250-super-duty-king-ranch-truck-f8587md', 2014, 'Ford', 'F-250', 'Super Duty King Ranch Truck', 'truck', 163082, 28500, 'Automatic', 'Diesel', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2014-honda-pilot-ex-l-suv-h1653ad', 2014, 'Honda', 'Pilot', 'EX-L SUV', 'suv', 156759, 12750, 'Automatic', 'Gasoline', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2013-audi-q5-ks077694', 2013, 'AUDI', 'Q5', '2.0T PREMIUM PLUS SPORT UTILITY 4D', 'suv', 119895, 8495, 'AUTOMATIC', 'GASOLINE', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2012-ford-f-250-xlt-truck-f0477md', 2012, 'Ford', 'F-250', 'XLT Truck', 'truck', 228997, 17800, 'Automatic', 'Diesel', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2012-jeep-wrangler-ks197935', 2012, 'JEEP', 'Wrangler', 'SPORT SUV 2D', 'suv', 113076, 11995, 'AUTOMATIC', 'GASOLINE', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2012-lincoln-mks-nb806168', 2012, 'LINCOLN', 'Mks', 'ECOBOOST SEDAN 4D', 'sedan', 112018, 9995, 'AUTOMATIC', 'GASOLINE', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2008-honda-civic-ks561599', 2008, 'HONDA', 'Civic', 'EX-L COUPE 2D', 'sedan', 171871, 4995, 'AUTOMATIC', 'GASOLINE', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2008-mercedes-benz-e-550-sedan-m7157mp', 2008, 'Mercedes-Benz', 'E', '550 Sedan', 'sedan', 128066, 8500, 'Automatic', 'Gasoline', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2005-jeep-liberty-renegade-suv-j9103tt', 2005, 'Jeep', 'Liberty', 'Renegade SUV', 'suv', 245810, 2800, 'Automatic', 'Gasoline', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2003-ford-mustang-ab346547', 2003, 'FORD', 'Mustang', 'GT DELUXE COUPE 2D', 'sedan', 67358, 13995, 'AUTOMATIC', 'GASOLINE', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2001-mercedes-benz-slk-slk-320-convertible-m8755md', 2001, 'Mercedes-Benz', 'SLK', 'SLK 320 Convertible', 'sedan', 52601, 10500, '6 Speed Manual', 'Gasoline', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('1995-chevrolet-w-t-truck-c1813mp', 1995, 'Chevrolet', 'W/T', 'Truck', 'truck', 148099, 9399, 'Automatic', 'Gasoline', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2024-mullen-one-van-m0031md', 2024, 'Mullen', 'ONE', 'Van', 'van', 146, 9999, 'Automatic', 'Electric', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available'),
  ('2024-mullen-one-van-m0042md', 2024, 'Mullen', 'ONE', 'Van', 'van', 120, 9999, 'Automatic', 'Electric', 'Contact OpenRoad Auto Group for details on this vehicle.', 'available')
  on conflict (stock_number) do update set
    year = excluded.year, make = excluded.make, model = excluded.model, trim = excluded.trim,
    body_type = excluded.body_type, mileage = excluded.mileage, price = excluded.price,
    transmission = excluded.transmission, fuel_type = excluded.fuel_type, status = excluded.status
  returning id, stock_number
)
insert into openroad_vehicle_images (vehicle_id, url, sort_order, is_primary)
select inserted.id, seed.url, 0, true
from inserted
join (values
  ('2022-hyundai-venue-sel-wagon-h4841ad', '/inventory/auto-district-images/2022-hyundai-venue-sel-wagon-h4841ad/1.jpg'),
  ('2021-honda-odyssey-touring-van-h4294my', '/inventory/auto-district-images/2021-honda-odyssey-touring-van-h4294my/1.jpg'),
  ('2020-jeep-gladiator-nm182378', '/inventory/express-images/2020-jeep-gladiator-nm182378/2.jpg'),
  ('2019-honda-cr-v-nb603749', '/inventory/express-images/2019-honda-cr-v-nb603749/2.jpg'),
  ('2019-volkswagen-jetta-sel-sedan-v5943sf', '/inventory/auto-district-images/2019-volkswagen-jetta-sel-sedan-v5943sf/1.jpg'),
  ('2017-buick-envision-ab104807', '/inventory/express-images/2017-buick-envision-ab104807/1.jpg'),
  ('2017-chevrolet-equinox-171494', '/inventory/express-images/2017-chevrolet-equinox-171494/2.jpg'),
  ('2016-chevrolet-tahoe-nb332503', '/inventory/express-images/2016-chevrolet-tahoe-nb332503/2.jpg'),
  ('2016-chevrolet-traverse-lt-suv-c2379my', '/inventory/auto-district-images/2016-chevrolet-traverse-lt-suv-c2379my/1.jpg'),
  ('2016-ford-f-250-super-duty-xl-truck-f6783md', '/inventory/auto-district-images/2016-ford-f-250-super-duty-xl-truck-f6783md/1.jpg'),
  ('2016-honda-pilot-ex-l-w-res-suv-h7615ad', '/inventory/auto-district-images/2016-honda-pilot-ex-l-w-res-suv-h7615ad/1.jpg'),
  ('2016-kia-sorento-nm051519', '/inventory/express-images/2016-kia-sorento-nm051519/2.jpg'),
  ('2015-audi-a3-2-0-premium-tdi-sedan-a6923mp', '/inventory/auto-district-images/2015-audi-a3-2-0-premium-tdi-sedan-a6923mp/1.jpg'),
  ('2015-bmw-750i-xdrive-sedan-b5964my', '/inventory/auto-district-images/2015-bmw-750i-xdrive-sedan-b5964my/1.jpg'),
  ('2015-ford-f-150-xl-truck-f5510md', '/inventory/auto-district-images/2015-ford-f-150-xl-truck-f5510md/1.jpg'),
  ('2015-ford-mustang-ks386551', '/inventory/express-images/2015-ford-mustang-ks386551/2.jpg'),
  ('2014-ford-f-250-super-duty-king-ranch-truck-f8587md', '/inventory/auto-district-images/2014-ford-f-250-super-duty-king-ranch-truck-f8587md/1.jpg'),
  ('2014-honda-pilot-ex-l-suv-h1653ad', '/inventory/auto-district-images/2014-honda-pilot-ex-l-suv-h1653ad/1.jpg'),
  ('2013-audi-q5-ks077694', '/inventory/express-images/2013-audi-q5-ks077694/2.jpg'),
  ('2012-ford-f-250-xlt-truck-f0477md', '/inventory/auto-district-images/2012-ford-f-250-xlt-truck-f0477md/1.jpg'),
  ('2012-jeep-wrangler-ks197935', '/inventory/express-images/2012-jeep-wrangler-ks197935/2.jpg'),
  ('2012-lincoln-mks-nb806168', '/inventory/express-images/2012-lincoln-mks-nb806168/2.jpg'),
  ('2008-honda-civic-ks561599', '/inventory/express-images/2008-honda-civic-ks561599/1.jpg'),
  ('2008-mercedes-benz-e-550-sedan-m7157mp', '/inventory/auto-district-images/2008-mercedes-benz-e-550-sedan-m7157mp/1.jpg'),
  ('2005-jeep-liberty-renegade-suv-j9103tt', '/inventory/auto-district-images/2005-jeep-liberty-renegade-suv-j9103tt/1.jpg'),
  ('2003-ford-mustang-ab346547', '/inventory/express-images/2003-ford-mustang-ab346547/1.jpg'),
  ('2001-mercedes-benz-slk-slk-320-convertible-m8755md', '/inventory/auto-district-images/2001-mercedes-benz-slk-slk-320-convertible-m8755md/1.jpg'),
  ('1995-chevrolet-w-t-truck-c1813mp', '/inventory/auto-district-images/1995-chevrolet-w-t-truck-c1813mp/1.jpg'),
  ('2024-mullen-one-van-m0031md', '/inventory/auto-district-images/2024-mullen-one-van-m0031md/1.jpg'),
  ('2024-mullen-one-van-m0042md', '/inventory/auto-district-images/2024-mullen-one-van-m0042md/1.jpg')
) as seed(stock_number, url) on seed.stock_number = inserted.stock_number
where not exists (
  select 1 from openroad_vehicle_images existing
  where existing.vehicle_id = inserted.id and existing.url = seed.url
);
