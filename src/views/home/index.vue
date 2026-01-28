<script setup lang="ts">
import { 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  HeadphonesIcon, 
  ArrowRight,
  CheckCircle,
} from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardDescription from '@/components/ui/CardDescription.vue'
import CardContent from '@/components/ui/CardContent.vue'

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get deep insights into your business metrics with powerful analytics and real-time reporting.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and security protocols to keep your data safe and compliant.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance ensures your team never waits. Speed is our priority.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates and role-based permissions.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Built for businesses of all sizes, from startups to Fortune 500 companies.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our dedicated support team is always ready to help you succeed.",
  },
]

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "50M+", label: "Records Managed" },
  { value: "150+", label: "Countries" },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out our platform",
    features: [
      "Up to 3 team members",
      "Basic analytics",
      "Email support",
      "1GB storage",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$29",
    description: "Best for growing businesses",
    features: [
      "Unlimited team members",
      "Advanced analytics",
      "Priority support",
      "100GB storage",
      "API access",
      "Custom integrations",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large scale operations",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom SLA",
      "Unlimited storage",
      "SSO & SAML",
      "On-premise option",
    ],
    popular: false,
  },
]
</script>

<template>
  <div class="animate-in">
    <!-- Hero Section -->
    <section class="relative overflow-hidden py-20 md:py-32">
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div class="container text-center">
        <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-in">
          <Zap class="h-4 w-4" />
          <span>New: AI-powered insights now available</span>
        </div>

        <h1 class="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight animate-in">
          Manage Your Business
          <br />
          <span class="text-primary">Smarter & Faster</span>
        </h1>

        <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-in">
          The all-in-one platform for modern businesses. Streamline
          operations, boost productivity, and scale with confidence.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-in">
          <Button size="lg" as-child>
            <router-link to="/register">
              Register <ArrowRight class="ml-2 h-4 w-4" />
            </router-link>
          </Button>
          <Button size="lg" variant="outline" as-child>
            <router-link to="/login">Login</router-link>
          </Button>
        </div>

        <div class="mt-12 flex flex-wrap justify-center gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center animate-in">
            <div class="text-3xl font-bold text-foreground">
              {{ stat.value }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-muted/30">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to succeed
          </h2>
          <p class="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you manage, analyze, and grow
            your business efficiently.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="feature in features"
            :key="feature.title"
            class="border-0 shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardHeader>
              <div class="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <component :is="feature.icon" class="h-6 w-6 text-primary" />
              </div>
              <CardTitle class="text-xl">{{ feature.title }}</CardTitle>
              <CardDescription>{{ feature.description }}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p class="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for your business. All plans include
            a 14-day free trial.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card
            v-for="plan in pricingPlans"
            :key="plan.name"
            class="border-2 transition-all"
            :class="plan.popular ? 'border-primary shadow-xl scale-105 z-10' : 'border-border'"
          >
            <div v-if="plan.popular" class="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
              Most Popular
            </div>
            <CardHeader class="text-center">
              <CardTitle class="text-2xl">{{ plan.name }}</CardTitle>
              <CardDescription>{{ plan.description }}</CardDescription>
              <div class="mt-4">
                <span class="text-4xl font-bold text-foreground">
                  {{ plan.price }}
                </span>
                <span v-if="plan.price !== 'Free' && plan.price !== 'Custom'" class="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul class="space-y-3 mb-6">
                <li
                  v-for="feature in plan.features"
                  :key="feature"
                  class="flex items-center gap-2 text-sm"
                >
                  <CheckCircle class="h-4 w-4 text-success flex-shrink-0" />
                  <span>{{ feature }}</span>
                </li>
              </ul>
              <Button
                class="w-full"
                :variant="plan.popular ? 'default' : 'outline'"
                as-child
              >
                <router-link to="/register">
                  {{ plan.price === 'Custom' ? 'Contact Sales' : 'Get Started' }}
                </router-link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 gradient-primary relative overflow-hidden">
      <div class="absolute inset-0 bg-black/20" />
      <div class="container relative z-10 text-center text-white">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Ready to transform your business?
        </h2>
        <p class="text-white/80 max-w-2xl mx-auto mb-8">
          Join thousands of businesses that trust us with their operations.
          Start your free trial today—no credit card required.
        </p>
        <Button size="lg" variant="secondary" as-child>
          <router-link to="/register">
            Start Free Trial <ArrowRight class="ml-2 h-4 w-4" />
          </router-link>
        </Button>
      </div>
    </section>
  </div>
</template>
