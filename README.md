# Portfolio + Recruiter Inquiry System

A self-contained project: your portfolio site with a recruiter/hiring inquiry
form, a Node.js/Express API, a PostgreSQL database, and a small admin
dashboard — built as container images to run in Kubernetes.

```
portfolio-app/
├── backend/               Node.js + Express API
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── src/
│   │   ├── server.js      App entrypoint
│   │   ├── db.js          Postgres connection pool
│   │   ├── db/
│   │   │   ├── schema.sql      Table definitions
│   │   │   ├── migrate.js      Applies schema.sql
│   │   │   └── seedAdmin.js    Creates your admin login (interactive)
│   │   ├── middleware/
│   │   │   ├── auth.js         JWT verification
│   │   │   └── errorHandler.js
│   │   └── routes/
│   │       ├── auth.js         POST /api/auth/login, GET /api/auth/me
│   │       └── inquiries.js    POST /api/inquiries (public) + admin CRUD
│   ├── package.json
│   └── .env.example        For running the API directly with `node`/`npm run dev` (no image)
├── frontend/
│   ├── Dockerfile
│   ├── index.html          Your portfolio + the recruiter inquiry form
│   └── admin.html          Login + dashboard to view/manage inquiries
├── k8s/                    Kubernetes manifests
│   ├── backend-configmap.yaml
│   ├── backend-secret.example.yaml     (template — don't apply as-is)
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml        (includes matching Service)
│   ├── postgres-secret.example.yaml    (template — don't apply as-is)
│   ├── postgres-statefulset.yaml       (includes matching headless Service)
│   ├── migrate-job.yaml
│   └── ingress.yaml
└── .gitignore
```

## 1. Build and push the images

```bash
cd backend
docker build -t YOUR_REGISTRY/portfolio-backend:1.0.0 .
docker push YOUR_REGISTRY/portfolio-backend:1.0.0
```

Before building the frontend image, decide how it'll reach the API:
- **Behind the shared Ingress** (recommended, see `k8s/ingress.yaml`): open
  `frontend/index.html` and `frontend/admin.html`, set `API_BASE = ''` —
  requests become same-origin (`/api/...`), no CORS needed.
- **Different host/port**: leave `API_BASE` as the full backend URL and set
  `CORS_ORIGIN` in `backend-configmap.yaml` to match the frontend's origin.

```bash
cd ../frontend
docker build -t YOUR_REGISTRY/portfolio-frontend:1.0.0 .
docker push YOUR_REGISTRY/portfolio-frontend:1.0.0
```

Use a real, immutable tag (`1.0.0`, a git SHA, etc.) — never `:latest`. If
you're running the Kyverno policy from your other DevSecOps project in this
same cluster, it'll reject `:latest` at admission anyway.

Update the `image:` field in `k8s/backend-deployment.yaml`,
`k8s/migrate-job.yaml`, and `k8s/frontend-deployment.yaml` to match what you
pushed.

## 2. Create the secrets (don't commit these)

```bash
kubectl create namespace portfolio

kubectl create secret generic portfolio-postgres-secret \
  --from-literal=POSTGRES_USER=portfolio_app \
  --from-literal=POSTGRES_PASSWORD='<pick-a-strong-password>' \
  --from-literal=POSTGRES_DB=portfolio \
  -n portfolio

kubectl create secret generic portfolio-backend-secret \
  --from-literal=PGUSER=portfolio_app \
  --from-literal=PGPASSWORD='<same-password-as-above>' \
  --from-literal=JWT_SECRET="$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")" \
  -n portfolio
```

(`backend-secret.example.yaml` / `postgres-secret.example.yaml` show the
shape of these Secrets for reference — don't `kubectl apply` them directly.)

## 3. Deploy

```bash
kubectl apply -f k8s/backend-configmap.yaml -n portfolio
kubectl apply -f k8s/postgres-statefulset.yaml -n portfolio
kubectl apply -f k8s/backend-deployment.yaml -n portfolio
kubectl apply -f k8s/backend-service.yaml -n portfolio
kubectl apply -f k8s/frontend-deployment.yaml -n portfolio
```

Wait for Postgres to be ready, then run the migration once:

```bash
kubectl apply -f k8s/migrate-job.yaml -n portfolio
kubectl logs job/portfolio-migrate -n portfolio    # should end with "Schema is up to date."
kubectl delete job portfolio-migrate -n portfolio
```

Create your admin login (interactive, so run it against a live pod rather
than as a Job):

```bash
kubectl exec -it deploy/portfolio-backend -n portfolio -- npm run seed:admin
```

Then expose it:

```bash
kubectl apply -f k8s/ingress.yaml -n portfolio
```

Point `k8s/ingress.yaml`'s `host` at your real domain first (or your
cluster's local equivalent if testing on Minikube).

## 4. Try it end to end

1. Visit your Ingress host → **Hiring? Reach out** tab → submit a test inquiry.
2. Visit `<host>/admin.html` → sign in with the credentials from step 3 →
   see the inquiry, change its status, or delete it.

## Local development without Kubernetes

If you just want to iterate on the code before building images, you can
still run Postgres and the API directly:

```bash
# Postgres — any local install, or a one-off container:
docker run --rm -d --name portfolio-postgres \
  -e POSTGRES_DB=portfolio -e POSTGRES_USER=portfolio_app \
  -e POSTGRES_PASSWORD=change_me_locally -p 5432:5432 postgres:16-alpine

cd backend
cp .env.example .env    # fill in JWT_SECRET, matching Postgres creds above
npm install
npm run migrate
npm run seed:admin
npm run dev              # → http://localhost:3001
```

Serve `frontend/` with anything static (`npx serve frontend -l 5500`) — with
`API_BASE` left as `http://localhost:3001`, it'll talk straight to the local
API.

## Security notes (this matters if you ever deploy this publicly)

- Passwords are hashed with bcrypt (cost factor 12) — never stored in plaintext.
- Admin routes require a valid, signed JWT (`JWT_SECRET`); tokens expire
  (`JWT_EXPIRES_IN`, default 8h).
- The public inquiry endpoint is rate-limited per IP (default: 5/hour) to
  blunt spam/abuse; the login endpoint is separately rate-limited (10/15min)
  against brute-forcing.
- All inputs are validated and length-capped server-side with
  `express-validator` — client-side validation is UX only, never trust it
  as the security boundary.
- All database queries use parameterized `$1, $2…` placeholders — never
  string-concatenated SQL — so this is not vulnerable to SQL injection.
- `helmet` sets standard security headers; `cors` restricts which origin can
  call the API from a browser.
- `.env` (real secrets) is git-ignored — only `.env.example` (no real values)
  is committed.

If you expose the Ingress publicly, make sure TLS is actually terminating
(the `ingress.yaml` template assumes cert-manager or a similar setup
provisions `portfolio-tls`) and that `CORS_ORIGIN` / `API_BASE` point at the
real domain, not `localhost`. This is a natural fit for the CI/CD pipeline
in your other DevSecOps project — Trivy-scan both images, Semgrep the
backend source, Cosign-sign before Argo CD picks up the new tag.

## API reference

| Method | Path                  | Auth   | Purpose                          |
|--------|------------------------|--------|-----------------------------------|
| GET    | `/api/health`          | none   | Health check                      |
| POST   | `/api/inquiries`       | none   | Submit a recruiter inquiry        |
| GET    | `/api/inquiries`       | admin  | List inquiries (`?status=`, `?limit=`, `?offset=`) |
| PATCH  | `/api/inquiries/:id`   | admin  | Update status (new/contacted/archived) |
| DELETE | `/api/inquiries/:id`   | admin  | Delete an inquiry                 |
| POST   | `/api/auth/login`      | none   | Get a JWT (email + password)      |
| GET    | `/api/auth/me`         | admin  | Verify current token              |
