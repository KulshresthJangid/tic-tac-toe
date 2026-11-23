// Technical posts drawn from case studies already on the site. Paragraph text
// supports `inline code` between backticks. Numbers about my own projects come
// from projects.ts; anything attributed to a third party (Stripe, Meta, the
// Google SRE Workbook) is a description of their public documentation, not
// something I measured.

export type PostBlock =
  | { t: 'h2'; text: string }
  | { t: 'p'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'code'; lang: string; code: string }

export interface Post {
  slug: string
  /** <title>, kept under 60 characters. */
  title: string
  /** meta description, kept under 155 characters. */
  description: string
  h1: string
  excerpt: string
  datePublished: string
  dateModified: string
  tags: string[]
  /** The case study this post expands on. */
  projectId: string
  /** Service page this post should link to. */
  serviceSlug: string
  body: PostBlock[]
}

export const posts: Post[] = [
  {
    slug: 'receive-stripe-whatsapp-webhooks-locally-without-ngrok',
    title: 'Local Stripe & WhatsApp Webhooks Without ngrok',
    description:
      'How a webhook relay verifies Stripe and Meta payloads, logs every event and replays it to localhost, so you never expose your dev machine.',
    h1: 'Receiving Stripe and WhatsApp webhooks locally without exposing your machine',
    excerpt:
      'Tunnels work until they do not. Here is the relay design I use instead: verify at the edge, store every payload, replay on demand.',
    datePublished: '2026-11-21',
    dateModified: '2026-11-21',
    tags: ['Webhooks', 'Node.js', 'Stripe', 'Security'],
    projectId: 'webhook-proxy',
    serviceSlug: 'node-typescript-api-development',
    body: [
      {
        t: 'p',
        text: 'Integrating Stripe or WhatsApp means receiving live event notifications while you build. The usual answer is a tunnel such as ngrok or an SSH forward, which gives the public internet a direct path to a port on your laptop. It also leaves you re-triggering the same event from the vendor dashboard every time your handler throws. I built a small relay to remove both problems, and this post walks through how it works.',
      },
      { t: 'h2', text: 'Why a tunnel is the wrong default' },
      {
        t: 'p',
        text: 'A tunnel exposes your development environment, which often holds real API keys and test data, to anyone who finds or guesses the URL. Free tunnel URLs also change between sessions, so you keep updating webhook settings in each vendor dashboard. And the debugging loop is slow: to retest one failing handler you need the vendor to send the event again.',
      },
      { t: 'h2', text: 'The relay design' },
      {
        t: 'p',
        text: 'The relay is a single public HTTPS endpoint that receives every inbound webhook. For each request it does four things in order: resolve the target registration, verify the vendor signature, persist the raw payload, and forward it to the registered local URL. The developer machine never accepts a connection from the internet. It only receives forwarded requests, or pulls them, from a server you control.',
      },
      {
        t: 'ul',
        items: [
          'Express handles the public endpoint and looks up the target registration in MongoDB.',
          'Vendor verification runs before anything is forwarded or stored as trusted.',
          'Every payload is saved with timestamp, vendor, headers, raw body, forwarding target, response status and latency.',
          'A replay endpoint re-sends a stored payload to the target on demand.',
        ],
      },
      { t: 'h2', text: 'Verifying Stripe signatures correctly' },
      {
        t: 'p',
        text: 'Stripe signs each webhook with an HMAC of the timestamp and the raw request body, and sends it in the `stripe-signature` header. Two details cause most bugs. You must verify against the raw bytes, so register the raw body parser on the webhook route before any JSON parser. And you must compare signatures in constant time, because a normal string comparison can leak how many leading characters matched.',
      },
      {
        t: 'code',
        lang: 'ts',
        code: `import { createHmac, timingSafeEqual } from 'node:crypto'

// Simplified: Stripe may send several v1 signatures during secret rotation.
export function verifyStripeSignature(
  rawBody: Buffer,
  header: string,
  secret: string,
  toleranceSeconds = 300,
): boolean {
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=') as [string, string]))
  const timestamp = parts.t
  const signature = parts.v1
  if (!timestamp || !signature) return false

  // Reject old events so a captured request cannot be replayed later.
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > toleranceSeconds) return false

  const expected = createHmac('sha256', secret)
    .update(\`\${timestamp}.\${rawBody.toString('utf8')}\`)
    .digest('hex')

  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && timingSafeEqual(a, b)
}`,
      },
      { t: 'h2', text: 'The Meta and WhatsApp handshake' },
      {
        t: 'p',
        text: 'Meta works differently. When you register a webhook, it first sends a GET request with `hub.mode`, `hub.verify_token` and `hub.challenge`. If the token matches yours, you must echo the challenge back as plain text, otherwise the subscription is rejected. Only after that does Meta send POST payloads. The relay answers the GET itself, so the handshake succeeds even when your local machine is switched off.',
      },
      {
        t: 'code',
        lang: 'ts',
        code: `app.get('/webhooks/meta', (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query
  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return res.status(200).send(String(challenge))
  }
  return res.sendStatus(403)
})`,
      },
      { t: 'h2', text: 'Store everything, then replay' },
      {
        t: 'p',
        text: 'The feature that saves the most time is boring: keep the raw payload. Once an event is stored with its headers and body, `POST /replay/:eventId` can send the identical bytes to your local handler as many times as you like. You fix the bug, replay the event, and check the result, without going back to the Stripe dashboard to trigger it again. The relay also records the forwarding response and latency, which gives you a debugging trail across sessions.',
      },
      { t: 'h2', text: 'What changed in practice' },
      {
        t: 'p',
        text: 'Local development no longer exposes a port to the internet, so the security risk of a tunnel is gone. Integration testing ran about twice as fast, because replay replaced the multi-step manual re-trigger cycle. The relay is also vendor-agnostic by design: adding GitHub, Shopify or Twilio means adding a verification module, not changing the core.',
      },
      {
        t: 'p',
        text: 'If you want the full architecture, the case study covers the dashboard, JWT-protected admin API and Nginx setup. If you need something like this built for your own integrations, that is the kind of work I do as a freelance Node.js and TypeScript engineer.',
      },
    ],
  },
  {
    slug: 'multi-window-burn-rate-alerting-slo',
    title: 'Multi-Window Burn-Rate Alerting for SLOs',
    description:
      'Replace noisy CPU and error-rate alerts with SLO burn-rate alerting. Error budget math, Prometheus rules and the thresholds from the Google SRE Workbook.',
    h1: 'Multi-window burn-rate alerting: from noisy alerts to error budgets',
    excerpt:
      'Most pages come from symptoms. Burn-rate alerting pages you only when the SLO is genuinely at risk.',
    datePublished: '2026-11-21',
    dateModified: '2026-11-21',
    tags: ['SRE', 'Prometheus', 'SLO', 'Observability'],
    projectId: 'slo-observability',
    serviceSlug: 'api-performance-optimization',
    body: [
      {
        t: 'p',
        text: 'Most alerting pages on symptoms: CPU above 80%, memory pressure, error rate above a fixed threshold. The signal arrives late and carries no context about whether users are actually affected. On-call engineers learn to ignore the noise, which is how real incidents get missed. I replaced that approach with SLO-based alerting on a set of production services, and this post explains the method and the maths.',
      },
      { t: 'h2', text: 'Start with an SLO and an error budget' },
      {
        t: 'p',
        text: 'An SLO is a target for how often a service should be good. For availability that might be 99.9% of requests succeeding over 30 days. The error budget is the remainder: 0.1% of requests may fail before you breach the target. That budget is what you spend on releases, experiments and incidents. In the platform I built, availability and latency targets (99.9% success rate and p99 under 300ms) lived as version-controlled YAML per service, reviewed like any other service contract.',
      },
      { t: 'h2', text: 'Burn rate is how fast you spend the budget' },
      {
        t: 'p',
        text: 'Burn rate is the observed error ratio divided by the error budget ratio. A burn rate of 1 means you will use exactly your whole budget by the end of the window. A burn rate of 10 means you will exhaust it in a tenth of the time. This turns an arbitrary threshold such as "errors above 2%" into a statement about consequences: at this rate, the SLO is gone in X hours.',
      },
      { t: 'h2', text: 'Why one window is not enough' },
      {
        t: 'p',
        text: 'A single short window pages on every transient spike. A single long window detects real problems far too slowly. Multi-window alerting combines them. The Google SRE Workbook recommends, for a 30-day SLO, paging when the burn rate is at least 14.4 over 1 hour (2% of budget gone), paging again at 6 over 6 hours (5% gone), and opening a ticket at 1 over 3 days (10% gone). Each long window is paired with a short one, commonly one twelfth of its length, so the alert clears quickly once the problem stops.',
      },
      {
        t: 'ul',
        items: [
          'Fast burn, 1 hour and 6 hour windows: page the on-call engineer.',
          'Slow burn, 3 day window: send a ticket or Slack message, nobody gets woken up.',
          'Short companion window on each alert so it resets soon after recovery.',
        ],
      },
      { t: 'h2', text: 'Recording rules keep alert evaluation cheap' },
      {
        t: 'p',
        text: 'Computing a 3-day error ratio inside an alert expression is expensive and slow. Pre-compute each window with Prometheus recording rules, then keep the alert expressions simple. The rules below assume a counter named `http_requests_total` with a `code` label.',
      },
      {
        t: 'code',
        lang: 'yaml',
        code: `groups:
  - name: slo-checkout-recording
    rules:
      - record: slo:error_ratio:rate5m
        expr: |
          sum(rate(http_requests_total{job="checkout",code=~"5.."}[5m]))
          / sum(rate(http_requests_total{job="checkout"}[5m]))
      - record: slo:error_ratio:rate1h
        expr: |
          sum(rate(http_requests_total{job="checkout",code=~"5.."}[1h]))
          / sum(rate(http_requests_total{job="checkout"}[1h]))

  - name: slo-checkout-alerts
    rules:
      - alert: CheckoutFastBurn
        # 14.4 x the 0.1% budget ratio, on both the long and the short window
        expr: slo:error_ratio:rate1h > (14.4 * 0.001) and slo:error_ratio:rate5m > (14.4 * 0.001)
        labels: { severity: page }`,
      },
      { t: 'h2', text: 'Dashboards that show the budget, not the symptom' },
      {
        t: 'p',
        text: 'Alerts are half of it. I built Grafana dashboards showing remaining error budget as a percentage, projected exhaustion time and a per-endpoint SLO heatmap. That gives engineering a shared, numeric answer to "can we ship this week?". When the budget is nearly spent, reliability work takes priority. When it is healthy, you can take more risk. The budget becomes an engineering constraint instead of a vanity metric.',
      },
      { t: 'h2', text: 'Make incidents easier to investigate' },
      {
        t: 'p',
        text: 'Alerting tells you that users are hurting, not why. Structured JSON logs from Spring Boot went through Logstash into Elasticsearch, with a correlation ID and trace ID on every line, so Kibana and Jaeger could be joined during an investigation. The standard was adopted across services, and post-incident timelines could be assembled from log queries and trace spans instead of memory.',
      },
      { t: 'h2', text: 'What changed' },
      {
        t: 'p',
        text: 'SLO coverage spanned 8 production services. Multi-window burn-rate evaluation removed the single-spike false positives that used to trigger unnecessary pages, and on-call alert noise dropped significantly. On-call now gets paged only when the burn rate indicates a genuine threat to SLO compliance within the measurement window.',
      },
      {
        t: 'p',
        text: 'The full write-up is in the case study. If your team is drowning in alerts or has no SLOs yet, this is a contained piece of work that I can scope for you.',
      },
    ],
  },
  {
    slug: 'multi-tenant-oidc-spring-authorization-server',
    title: 'Multi-Tenant OIDC with Spring Authorization Server',
    description:
      'Design notes from building a multi-tenant OpenID Connect server: tenant resolution, custom JWT claims, per-tenant clients, PKCE and Flyway migrations.',
    h1: 'Building a multi-tenant OIDC authorization server with Spring Authorization Server',
    excerpt:
      'Tenant resolution, per-tenant clients and custom claims: the design decisions behind a multi-tenant single sign-on server.',
    datePublished: '2026-11-21',
    dateModified: '2026-11-21',
    tags: ['OIDC', 'Spring Boot', 'Security', 'Multi-tenancy'],
    projectId: 'sso-platform',
    serviceSlug: 'saas-backend-development',
    body: [
      {
        t: 'p',
        text: 'When every internal tool keeps its own passwords, you get credential sprawl, a steady stream of reset tickets and onboarding that takes hours of manual account creation. The fix is a central single sign-on server. I built a multi-tenant OpenID Connect authorization server on Spring Authorization Server, with an admin dashboard on top. This post covers the design decisions that mattered most.',
      },
      { t: 'h2', text: 'Separate security filter chains' },
      {
        t: 'p',
        text: 'Spring Security 6 lets you define several `SecurityFilterChain` beans, each matched to a request pattern. I used three: one for the authorization server endpoints (`/.well-known/openid-configuration`, `/oauth2/authorize`, `/oauth2/token`), one for the admin dashboard and one for the API layer. Each chain has its own rules, so a mistake in the dashboard configuration cannot loosen the protocol endpoints.',
      },
      { t: 'h2', text: 'Resolve the tenant before anything else' },
      {
        t: 'p',
        text: 'Tenant isolation fails when it is optional. A `TenantResolutionFilter` runs early, extracts the organisation slug from the request path or subdomain, loads the tenant context and makes it available to every downstream call. User lookups, client lookups and role assignments are all scoped by that context, so there is no code path that can read across tenants by accident. If no tenant can be resolved, the request stops there.',
      },
      { t: 'h2', text: 'Store registered clients per tenant' },
      {
        t: 'p',
        text: 'Spring Authorization Server stores OAuth2 clients through a `RegisteredClientRepository`. The in-memory version is fine for demos. For a real multi-tenant system I implemented a tenant-aware repository backed by PostgreSQL, so each organisation registers and revokes its own applications through the admin API. Confidential clients cover server-side apps. Public clients, meaning single-page apps, must use PKCE.',
      },
      {
        t: 'code',
        lang: 'java',
        code: `RegisteredClient spa = RegisteredClient.withId(UUID.randomUUID().toString())
    .clientId("admin-spa")
    .clientAuthenticationMethod(ClientAuthenticationMethod.NONE)
    .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
    .redirectUri("https://app.example.com/callback")
    .scope(OidcScopes.OPENID)
    // PKCE is mandatory: an intercepted authorization code is useless without the verifier.
    .clientSettings(ClientSettings.builder().requireProofKey(true).build())
    .build();`,
      },
      { t: 'h2', text: 'Put authorization data in the token' },
      {
        t: 'p',
        text: 'A token customizer adds the organisation ID, tenant slug and role claims to every issued JWT. Downstream services can then enforce role-based access straight from the token, without a second round trip to look the user up. The trade-off is that claims go stale until the token expires, so keep access token lifetimes short and treat role changes as eventually consistent.',
      },
      {
        t: 'code',
        lang: 'java',
        code: `// Simplified. TenantContext and rolesFor() are application code.
@Bean
OAuth2TokenCustomizer<JwtEncodingContext> tokenCustomizer(TenantContext tenants) {
  return context -> {
    if (OAuth2TokenType.ACCESS_TOKEN.equals(context.getTokenType())) {
      Tenant tenant = tenants.current();
      context.getClaims()
          .claim("org_id", tenant.id())
          .claim("tenant", tenant.slug())
          .claim("roles", rolesFor(context.getPrincipal(), tenant));
    }
  };
}`,
      },
      { t: 'h2', text: 'Let non-engineers run it' },
      {
        t: 'p',
        text: 'The admin dashboard is a React and Vite single-page app that signs in through the same authorization server it manages. Administrators create and deactivate users, define and assign roles and register or revoke OAuth2 applications without touching configuration files. This is where most of the provisioning time saving came from: onboarding became a form instead of a ticket.',
      },
      { t: 'h2', text: 'Schema changes belong in version control' },
      {
        t: 'p',
        text: 'Authorization, consent and token tables follow Spring Authorization Server conventions, and every schema change goes through Flyway migrations applied on startup. For an identity service this matters more than usual, because a schema drift between environments is a security problem, not just an inconvenience.',
      },
      { t: 'h2', text: 'Results' },
      {
        t: 'p',
        text: 'Password compliance reached 100% across connected corporate systems, since there is one credential and one audited authentication path. Employee provisioning and onboarding time dropped by 50%. Any standards-compliant client can integrate through the discovery document in minutes. The case study has the complete architecture, and if you need a multi-tenant authentication layer for your own product, I can build it as part of a SaaS backend engagement.',
      },
    ],
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}
