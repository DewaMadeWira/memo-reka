@echo off

echo Starting PHP server...
start "" php artisan serve

echo Starting npm development server...
start "" npm run dev


echo Starting Job Queue...
start "" php artisan queue:work

echo All servers started successfully.
