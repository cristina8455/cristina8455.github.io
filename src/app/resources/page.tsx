// src/app/resources/page.tsx
import { BookOpen, Calculator, GraduationCap, Link as LinkIcon, Library } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ResourceSection = {
    title: string;
    icon: LucideIcon;
    description: string;
    resources: {
        title: string;
        description: string;
        link?: string;
        courses?: string[];  // Optional: for course-specific resources
    }[];
};

const resourceSections: ResourceSection[] = [
    {
        title: 'Technology',
        icon: Calculator,
        description: 'Tools and technology resources for your courses',
        resources: [
            {
                title: 'TI-84 Calculator Guide',
                description: 'Official Texas Instruments guide for TI-84 Plus CE calculators, including tutorials and examples',
                link: 'https://education.ti.com/en/guidebook/details/en/97C07288457D4C0F918F4D9B78CAA422/84p-ce-guidebook'
            },
            {
                title: 'Canvas Student Guide',
                description: 'Comprehensive guide to using Canvas effectively, including submitting assignments and tracking grades',
                link: 'https://community.canvaslms.com/t5/Student-Guide/tkb-p/student'
            },
            {
                title: 'Desmos Graphing Calculator',
                description: 'Free online graphing calculator with advanced features for mathematical visualization',
                link: 'https://www.desmos.com/calculator'
            },
            {
                title: 'WolframAlpha',
                description: 'Computational knowledge engine useful for checking work and exploring mathematical concepts',
                link: 'https://www.wolframalpha.com'
            }
        ]
    },
    {
        title: 'CLC Resources',
        icon: Library,
        description: 'Support services and resources available at College of Lake County',
        resources: [
            {
                title: 'CLC Library',
                description: 'Access research materials, online databases, and study resources through the CLC Library',
                link: 'https://researchguides.clcillinois.edu/libraryhome'
            },
            {
                title: 'Mathematics Department',
                description: 'Information about CLC mathematics programs, courses, and department resources',
                link: 'https://www.clcillinois.edu/programs/egrdv/mathematics'
            },
            {
                title: 'Student Success Resources',
                description: 'Comprehensive guide to academic support services and resources at CLC',
                link: 'https://www.clcillinois.edu/why-clc/how-will-clc-help-me-to-be-successful/supporting-your-academic-journey'
            },
            {
                title: 'Math Center',
                description: 'Free mathematics tutoring and support services for CLC students'
            }
        ]
    },
    {
        title: 'Learning Resources',
        icon: BookOpen,
        description: 'Free online learning materials and practice resources',
        resources: [
            {
                title: 'OpenStax Mathematics',
                description: 'Free, peer-reviewed textbooks covering various mathematics topics, including calculus and statistics',
                link: 'https://openstax.org/subjects/math'
            },
            {
                title: 'Khan Academy Mathematics',
                description: 'Comprehensive collection of math video lessons and practice problems, from basic algebra through calculus',
                link: 'https://www.khanacademy.org/math'
            },
            {
                title: '3Blue1Brown',
                description: 'Engaging video explanations of mathematical concepts with beautiful visualizations',
                link: 'https://www.3blue1brown.com'
            },
            {
                title: 'Paul\'s Online Math Notes',
                description: 'Detailed course notes and examples for algebra, calculus, and differential equations',
                link: 'https://tutorial.math.lamar.edu'
            }
        ]
    },
    {
        title: 'Career Resources',
        icon: GraduationCap,
        description: 'Information about careers and further education in mathematics',
        resources: [
            {
                title: 'AMS Career Resources',
                description: 'American Mathematical Society\'s guide to careers in mathematics and statistics',
                link: 'https://www.ams.org/profession/career-info/career-index'
            },
            {
                title: 'MAA Career Resources',
                description: 'Mathematical Association of America\'s career guidance and opportunities in mathematics',
                link: 'https://www.maa.org/member-communities/students/career-resources'
            },
            {
                title: 'BLS Mathematics Careers',
                description: 'Bureau of Labor Statistics information about mathematics and statistics careers',
                link: 'https://www.bls.gov/ooh/math/home.htm'
            },
            {
                title: 'Transfer Planning',
                description: 'Resources for planning your transition to a four-year mathematics program'
            }
        ]
    }
];

function ResourceCard({
    title,
    description,
    resources
}: {
    title: string;
    description: string;
    resources: ResourceSection['resources'];
}) {
    return (
        <div className="bg-card rounded-lg border border-border p-4 hover:shadow-sm transition-shadow duration-200">
            <h3 className="font-medium mb-2 text-card-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="space-y-3">
                {resources.map((resource, index) => (
                    <div key={index} className="text-sm">
                        {resource.link ? (
                            <a
                                href={resource.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 font-medium flex items-center 
                                         transition-colors duration-200 group"
                            >
                                {resource.title}
                                <LinkIcon size={14} className="ml-1 opacity-70 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ) : (
                            <span className="font-medium text-card-foreground">{resource.title}</span>
                        )}
                        <p className="text-muted-foreground mt-1">{resource.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Resources() {
    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2 text-card-foreground">Student Resources</h2>
                    <p className="text-muted-foreground">
                        Helpful resources and materials to support your learning in mathematics and statistics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resourceSections.map((section) => (
                        <div key={section.title} className="flex flex-col">
                            <div className="mb-3 flex items-center">
                                <section.icon
                                    size={20}
                                    className="text-primary opacity-90 mr-2"
                                />
                                <h3 className="text-lg font-semibold text-card-foreground">
                                    {section.title}
                                </h3>
                            </div>
                            <ResourceCard
                                title={section.title}
                                description={section.description}
                                resources={section.resources}
                            />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}