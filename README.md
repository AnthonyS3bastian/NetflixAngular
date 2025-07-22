# 🥂 Softflix

**Softflix** es una plataforma estilo Netflix donde puedes ver trailers y películas no oficiales, gestionar tu perfil y favoritos, y explorar catálogos de series y filmes en una SPA construida con Angular 19 y Firebase.

---

## 🔎 Descripción

Softflix permite a los usuarios:

- Registrarse, iniciar sesión y cerrar sesión con Firebase Authentication.  
- Explorar listados de películas y series, y ver su detalle individual.  
- Buscar en tiempo real y filtrar resultados desde la barra de búsqueda.  
- Añadir o quitar favoritos, almacenados por usuario en Firestore.  
- Crear y editar **Series** (roles `author`/`admin`) y **Películas** (solo rol `admin`).  
- Editar su perfil (displayName, email, foto) con Firestore + Storage.  

---

## 🛠️ Tecnologías y Herramientas

| Tecnología               | Versión        |
|--------------------------|---------------:|
| Angular CLI              | 19.2.15        |
| @angular/core, @router   | 19.2.14 / 19.2.15 |
| TypeScript               | 5.7.3          |
| RxJS                     | 7.8.2          |
| Zone.js                  | 0.15.1         |
| @angular/fire            | 7.2.0          |
| @angular/material        | 19.2.19        |
| @angular/cdk             | 19.2.15        |
| Node.js                  | 22.16.0        |
| npm                      | 10.9.2         |
| Firebase CLI             | —              |
| Firestore Security Rules | v2             |
| SCSS (Flexbox & Grid)    | —              |
| Git & GitHub             | —              |

---

## ⚙️ Requisitos para Ejecutar

- Node.js ≥ 14  
- npm ≥ 6  
- Angular CLI compatible con Angular 19  
- Proyecto configurado con credenciales Firebase en `src/environments/environment.ts`  

---

## 🏗️ Arquitectura, Componentes y Servicios

La aplicación está organizada en tres capas principales:

### 1. `core/`

- **guards/**  
  - `admin.guard.ts` — Restringe rutas y acciones a usuarios con rol `admin`.  
- **series/**  
  - `series.model.ts` — Interfaces `Series` y `Season`.  
  - `series.service.ts` — CRUD de series en Firestore, semilla de datos y permisos por rol.  
- **auth.guard.ts** — Protege rutas que requieren usuario autenticado.  
- **auth.service.ts** — Registro, login, logout y estado `user$` (Firebase Auth).  
- **favorites.service.ts** — Gestión de favoritos en subcolección `users/{uid}/favorites`.  
- **movies.service.ts** — Mocks de películas con Signals y computeds (integrable a Firestore).  
- **profile.service.ts** — CRUD de perfil en Firestore + Storage (nombre, email, foto).

### 2. `shared/`

- `carousel/` — `CarouselComponent` para listas scrollables horizontales.  
- `search/` — `SearchComponent` con búsqueda en tiempo real.  
- `configuracion/` — `ConfiguracionComponent` para edición de perfil (formularios reactivos).  
- `navbar/` — `NavbarComponent` con enlaces dinámicos según estado y rol.

### 3. `pages/`

Cada carpeta en `pages/` corresponde a una ruta configurada en `app.routes.ts`:

- `favorite/` — `FavoritesComponent` (grid de favoritos).  
- `home/` — `HomeComponent` (Hero Banner + Carousels).  
- `login/` — `LoginComponent`.  
- `movie/` — `MovieListComponent`.  
- `movie-detail/` — `MovieDetailComponent`.  
- `not-found/` — `NotFoundComponent` para rutas wildcard.  
- `register/` — `RegisterComponent`.  
- `search/` — `SearchResultsComponent` (si aplica).  
- `series/` — `SeriesListComponent`, `SeriesDetailComponent`, `SeriesFormComponent`.  
- `upcoming/` — `UpcomingComponent` (películas o series próximas).

---

Cada componente es **standalone** e importa sólo los módulos necesarios (`CommonModule`, `RouterModule`, Angular Material, etc.). Las rutas privadas usan `AuthGuard` y `AdminGuard`, y las colecciones Firestore se acceden con reglas de seguridad basadas en el rol almacenado en el documento de usuario.

