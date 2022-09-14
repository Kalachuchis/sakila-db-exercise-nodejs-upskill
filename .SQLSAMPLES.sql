select * FROM film WHERE film_id in
(SELECT film_id FROM film_actor WHERE actor_id IN
(SELECT actor_id FROM actor WHERE last_name LIKE 'davis')
);



SELECT * , COUNT(inventory.film_id) AS numberofinventory FROM film
    LEFT JOIN inventory ON film.film_id = inventory.film_id
    LEFT JOIN rental ON inventory.inventory_id = rental.inventory_id
WHERE rental.return_date IS NOT NULL AND
film_id in
(SELECT film_id FROM film_actor WHERE actor_id IN
(SELECT actor_id FROM actor WHERE last_name LIKE 'davis')
);
GROUP BY film.film_id;


SELECT * , COUNT(inventory.film_id) AS itemsInStock FROM film
	LEFT JOIN film_actor ON film.film_id = film_actor.film_id
    LEFT JOIN actor ON film_actor.actor_id = actor.actor_id
    RIGHT JOIN inventory ON film.film_id = inventory.film_id 
    LEFT JOIN rental ON inventory.inventory_id = rental.inventory_id
WHERE rental.return_date IS NOT NULL AND actor.last_name LIKE 'davis'
GROUP BY film.film_id;



SELECT * , COUNT(inventory.film_id) AS numberofinventory FROM film
	LEFT JOIN film_actor ON film.film_id = film_actor.film_id
    LEFT JOIN actor ON film_actor.actor_id = actor.actor_id
    LEFT JOIN inventory ON film.film_id = inventory.film_id
    LEFT JOIN rental ON inventory.inventory_id = rental.inventory_id
WHERE rental.return_date IS NOT NULL AND
film.film_id in
(SELECT film_id FROM film_actor WHERE actor_id IN
(SELECT actor_id FROM actor WHERE last_name LIKE 'davis')
)
GROUP BY film.film_id;


SELECT title, inventory.inventory_id,  inventory.last_update FROM inventory
    JOIN film ON inventory.film_id = film.film_id 
    WHERE inventory.inventory_id NOT IN (SELECT inventory_id FROM inventory
join film using(film_id)
        JOIN rental USING (inventory_id)
        WHERE return_date IS NULL
        order by inventory_id;)
    ORDER BY film.film_id;