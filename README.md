# Ecommerce-Vintage-Back

## Mercado Pago (configuracion produccion)

Se agrego una configuracion de Mercado Pago asociada al usuario con rol `admin`.
Cuando un cliente hace una compra, el backend debe usar el `accessToken` guardado
por el admin (no se expone al frontend).

### Endpoints

- `PUT /mercadopago/config`
	- Guarda o actualiza `accessToken` y `publicKey` para el admin.
	- Body:
		```json
		{
			"accessToken": "PROD-ACCESS-TOKEN",
			"publicKey": "PROD-PUBLIC-KEY"
		}
		```

- `GET /mercadopago/config`
	- Devuelve `accessToken` y `publicKey` (uso admin/backoffice).

- `GET /mercadopago/public-key`
	- Devuelve solo `publicKey` (uso frontend, usuario no logueado).

- `POST /checkout`
	- Crea una preferencia de Mercado Pago usando el access token guardado del admin.
	- Body (ejemplo):
		```json
		{
			"items": [
				{
					"productId": "UUID",
					"title": "Producto",
					"quantity": 1,
					"unitPrice": 10000,
					"currencyId": "ARS",
					"description": "Descripcion",
					"pictureUrl": "https://..."
				}
			],
			"payer": {
				"email": "cliente@email.com",
				"name": "Nombre",
				"surname": "Apellido"
			},
			"externalReference": "ORDER-123",
			"notificationUrl": "https://tu-backend/webhooks/mercadopago"
		}
		```
	- Respuesta:
		```json
		{
			"id": "PREFERENCE_ID",
			"url": "https://www.mercadopago.com/..."
		}
		```

- `POST /webhooks/mercadopago`
	- Webhook de Mercado Pago para confirmar pagos.
	- Cuando el pago queda `approved`, descuenta stock segun los items guardados.

### Base de datos

Como `synchronize` esta en `false`, hay que crear la tabla y la FK manualmente.
SQL sugerido (PostgreSQL):

```sql
CREATE TABLE IF NOT EXISTS mercadopago_config (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	access_token text NOT NULL,
	public_key text NOT NULL,
	is_active boolean NOT NULL DEFAULT true,
	admin_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mercadopago_config_admin_user_id_idx
	ON mercadopago_config(admin_user_id);
```

## Prompt para frontend (copiar y pegar)

```text
Actualizar frontend con Mercado Pago:

1) Agregar pantalla de configuracion para admin con campos:
	 - Access Token (produccion)
	 - Public Key (produccion)
	 Guardar via PUT /mercadopago/config.

2) En checkout, para usuarios logueados o no logueados:
	- Obtener public key desde GET /mercadopago/public-key.
	- Crear preferencia con POST /checkout y recibir { id, url }.
	- Redirigir a la URL de Mercado Pago.
	- NO exponer access token en frontend.

3) Ajustar manejo de errores:
	 - Si /mercadopago/public-key devuelve 404, mostrar mensaje: "Configurar Mercado Pago en admin".

4) Configurar el webhook en Mercado Pago para POST /webhooks/mercadopago.
5) Usar el public key para inicializar el SDK de Mercado Pago en el cliente.
```
