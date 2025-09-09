
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { surveySchema } from "@/lib/schema";
import type { SurveyFormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Q4_OPTIONS, Q5_OPTIONS, Q7_OPTIONS, Q8_OPTIONS, Q9_OPTIONS, Q10_CHALLENGES_OPTIONS, Q11_OPTIONS } from "@/lib/constants";
import { COUNTRIES } from "@/lib/countries";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check, PlusCircle, Trash2, RotateCcw, Download, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { SAMPLE_SURVEY_DATA } from "@/lib/sample-data";


const TOTAL_STEPS = 15;

export default function SurveyForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showJumpButton, setShowJumpButton] = useState(false);
  const { toast } = useToast();

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      q1_name: "", q1_location: "", q1_country: "", q1_phone: "", q1_experience: 0, q1_role: "",
      q2_services: "", q2_unique: "",
      q3_persona: "",
      q4_perception: [], q4_other: "", 
      q5_emotions: [], q5_other: "",
      q6_why: "",
      q7_differentiation: [], q7_why: "", q7_other: "",
      q8_value: [], q8_other: "",
      q9_presence: [], q9_other: "",
      q10_rating: 5, q10_challenges: [], q10_other: "",
      q11_training: undefined, q12_details: "",
      q13_colors: "", q14_hobby: "", q15_final: "",
      competitors: [{ name: "" }],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "competitors",
  });
  
  const watchedName = form.watch("q1_name");

  useEffect(() => {
    if (watchedName === "0520") {
      form.reset(SAMPLE_SURVEY_DATA);
      setShowJumpButton(true);
      toast({
        title: "¡Formulario Autocompletado!",
        description: "Se han cargado los datos de muestra.",
      });
    } else {
        setShowJumpButton(false);
    }
  }, [watchedName, form, toast]);


  const handleStartOver = () => {
    form.reset();
    setCurrentStep(0);
    setShowJumpButton(false);
    window.scrollTo(0, 0);
  }

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS -1) {
        setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const exportToCsv = (data: SurveyFormData) => {
    const spanishHeaders: Record<keyof SurveyFormData, string> = {
        q1_name: "Nombre del profesional o la clínica",
        q1_location: "Ubicación de la clínica o consultorio",
        q1_country: "País",
        q1_phone: "Número de contacto",
        q1_experience: "Años de experiencia en medicina estética",
        q1_role: "¿Cuál es tu cargo o rol principal?",
        q2_services: "¿Cuáles son los tratamientos y servicios principales que ofrecen?",
        q2_unique: "¿Existen servicios o especialidades únicas que los diferencien?",
        q3_persona: "Si tu marca personal fuera una persona, ¿quién sería y por qué?",
        q4_perception: "Percepción de Marca deseada",
        q4_other: "Otra percepción",
        q5_emotions: "Emociones a evocar",
        q5_other: "Otras emociones",
        q6_why: "Impacto que buscas generar",
        q7_differentiation: "Diferenciación de la competencia",
        q7_why: "Descripción de la diferenciación",
        q7_other: "Otra diferenciación",
        q8_value: "Propuesta de valor",
        q8_other: "Otra propuesta de valor",
        q9_presence: "Presencia Online",
        q9_other: "Otros canales de presencia",
        q10_rating: "Calificación de presencia digital",
        q10_challenges: "Mayores desafíos en marketing digital",
        q10_other: "Otro desafío",
        q11_training: "¿Interesa capacitar a otros profesionales?",
        q12_details: "Temas específicos para capacitar",
        q13_colors: "Paleta de colores de la marca y por qué",
        q14_hobby: "Hobby o interés personal",
        q15_final: "Reflexión final",
        competitors: "Competidores clave"
    };

    const headers = (Object.keys(spanishHeaders) as Array<keyof SurveyFormData>);
    const csvRows = [];
    csvRows.push(headers.map(h => `"${spanishHeaders[h]}"`).join(','));

    const values = headers.map(header => {
        const value = data[header as keyof SurveyFormData];
        if (Array.isArray(value)) {
            if (header === 'competitors') {
                return `"${(value as {name?: string}[]).map(c => c.name).join('; ')}"`;
            }
            return `"${value.join('; ')}"`;
        }
        if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    });
    csvRows.push(values.join(','));

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const doctorName = data.q1_name || 'respuestas';
    const fileName = `Diagnostico Nyvara ${doctorName}.csv`;
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setCurrentStep(TOTAL_STEPS - 1);
  }
  
  const watchedTraining = form.watch("q11_training");
  const watchedRating = form.watch("q10_rating");
  const watchedDifferentiation = form.watch("q7_differentiation");
  const watchedValue = form.watch("q8_value");
  const watchedPresence = form.watch("q9_presence");
  const watchedChallenges = form.watch("q10_challenges");
  const watchedPerception = form.watch("q4_perception");
  const watchedEmotions = form.watch("q5_emotions");

  return (
    <>
      <div className="w-full bg-secondary rounded-full h-2.5 mb-8 shadow-inner">
        <Progress value={(currentStep / (TOTAL_STEPS - 1)) * 100} className="h-2.5" />
      </div>
      <Card className="shadow-2xl relative min-h-[500px]">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <div className={currentStep === 0 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Sección 1: Información Básica</h2>
                <p className="text-muted-foreground mb-6">Empecemos con algunos datos para conocerte mejor.</p>
                <FormField name="q1_name" control={form.control} render={({ field }) => <FormItem><FormLabel>Nombre del profesional o la clínica</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField name="q1_location" control={form.control} render={({ field }) => <FormItem><FormLabel>Ubicación de la clínica o consultorio</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField
                  name="q1_country"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>País</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? COUNTRIES.find(
                                    (country) => country.name === field.value
                                  )?.name
                                : "Selecciona un país"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar país..." />
                            <CommandEmpty>No se encontró el país.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-y-auto">
                              {COUNTRIES.map((country) => (
                                <CommandItem
                                  value={country.name}
                                  key={country.code}
                                  onSelect={() => {
                                    form.setValue("q1_country", country.name);
                                    const phoneValue = form.getValues("q1_phone");
                                    if (!phoneValue || !phoneValue.startsWith("+")) {
                                      form.setValue("q1_phone", country.dial_code);
                                    }
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      country.name === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {country.name} ({country.dial_code})
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField name="q1_phone" control={form.control} render={({ field }) => <FormItem><FormLabel>Número de contacto</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField name="q1_experience" control={form.control} render={({ field }) => <FormItem><FormLabel>Años de experiencia en medicina estética</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? null : +e.target.value)} /></FormControl><FormMessage /></FormItem>} />
                <FormField name="q1_role" control={form.control} render={({ field }) => <FormItem><FormLabel>¿Cuál es tu cargo o rol principal?</FormLabel><FormControl><Input placeholder="Ej. Director, médico estético, cirujano plástico, dermatólogo..." {...field} /></FormControl><FormMessage /></FormItem>} />
                {showJumpButton && (
                  <Button onClick={() => setCurrentStep(13)} className="mt-4">
                    Saltar al paso 14
                  </Button>
                )}
              </div>

              <div className={currentStep === 1 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Sección 1: Oferta de Servicios</h2>
                <p className="text-muted-foreground mb-6">Cuéntanos qué ofreces a tus pacientes.</p>
                <FormField name="q2_services" control={form.control} render={({ field }) => <FormItem><FormLabel>¿Cuáles son los tratamientos y servicios principales que ofrecen?</FormLabel><FormControl><Textarea rows={4} placeholder="Ej: Rellenos faciales con ácido hialurónico, bioestimuladores de colágeno (Radiesse, Sculptra), toxina botulínica, hilos tensores, microneedling, Morpheus8, radiofrecuencia, peelings químicos, tratamientos láser, armonización facial, masculinización facial..." {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField name="q2_unique" control={form.control} render={({ field }) => <FormItem><FormLabel>¿Existen servicios o especialidades únicas que los diferencien?</FormLabel><FormControl><Textarea rows={4} placeholder="Describe brevemente en qué consisten..." {...field} /></FormControl><FormMessage /></FormItem>} />
              </div>

              <div className={currentStep === 2 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Sección 2: Identidad y Valores</h2>
                <p className="text-muted-foreground mb-6">Vamos a definir la personalidad de tu marca.</p>
                <FormField name="q3_persona" control={form.control} render={({ field }) => <FormItem><FormLabel>Si tu marca personal fuera una persona, ¿quién sería y por qué?</FormLabel><FormControl><Textarea rows={4} placeholder="Ej: Un artista renacentista porque..." {...field} /></FormControl><FormMessage /></FormItem>} />
              </div>
              
              <div className={currentStep === 3 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Sección 2: Percepción de Marca</h2>
                <p className="text-muted-foreground mb-6">¿Qué imagen deseas que los pacientes tengan de ti? (Selecciona hasta 3)</p>
                <FormField name="q4_perception" control={form.control} render={({ field }) => <FormItem><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Q4_OPTIONS.map(item => (<FormField key={item} control={form.control} name="q4_perception" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-secondary p-3 rounded-md"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => { const current = field.value || []; if(checked) { if (current.length < 3) return field.onChange([...current, item]); } else { return field.onChange(current.filter(value => value !== item)); } }} /></FormControl><FormLabel className="font-normal cursor-pointer">{item}</FormLabel></FormItem>)}/>))}</div><FormMessage /></FormItem>} />
                 {watchedPerception?.includes("Otro") && (
                    <FormField name="q4_other" control={form.control} render={({ field }) => <FormItem className="mt-4"><FormLabel>Por favor, especifica tu percepción</FormLabel><FormControl><Textarea rows={3} placeholder="Escribe aquí..." {...field} /></FormControl><FormMessage /></FormItem>} />
                )}
              </div>
              
              <div className={currentStep === 4 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Sección 2: Emociones a Evocar</h2>
                <p className="text-muted-foreground mb-6">¿Qué emociones quieres evocar en tus pacientes? (Selecciona hasta 3)</p>
                <FormField name="q5_emotions" control={form.control} render={({ field }) => <FormItem><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Q5_OPTIONS.map(item => (<FormField key={item} control={form.control} name="q5_emotions" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-secondary p-3 rounded-md"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => { const current = field.value || []; if(checked) { if (current.length < 3) return field.onChange([...current, item]); } else { return field.onChange(current.filter(value => value !== item)); } }} /></FormControl><FormLabel className="font-normal cursor-pointer">{item}</FormLabel></FormItem>)}/>))}</div><FormMessage /></FormItem>} />
                 {watchedEmotions?.includes("Otro") && (
                    <FormField name="q5_other" control={form.control} render={({ field }) => <FormItem className="mt-4"><FormLabel>Por favor, especifica qué emociones</FormLabel><FormControl><Textarea rows={3} placeholder="Escribe aquí..." {...field} /></FormControl><FormMessage /></FormItem>} />
                )}
              </div>

              <div className={currentStep === 5 ? 'block' : 'hidden'}>
                 <h2 className="font-headline text-3xl text-primary mb-2">Sección 2: Tu Propósito</h2>
                 <p className="text-muted-foreground mb-6">Más allá del negocio, ¿cuál es tu misión?</p>
                 <FormField name="q6_why" control={form.control} render={({ field }) => <FormItem><FormLabel>En 1-2 frases, describe el impacto que buscas generar en tus pacientes.</FormLabel><FormControl><Textarea rows={4} placeholder="Ej: Quiero empoderar a mis pacientes..." {...field} /></FormControl><FormMessage /></FormItem>} />
              </div>

              <div className={currentStep === 6 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Sección 3: Diferenciación</h2>
                <p className="text-muted-foreground mb-6">¿Cómo te diferencias de la competencia? (Selecciona hasta 3)</p>
                <FormField name="q7_differentiation" control={form.control} render={({ field }) => <FormItem><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Q7_OPTIONS.map(item => (<FormField key={item.value} control={form.control} name="q7_differentiation" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-secondary p-3 rounded-md"><FormControl><Checkbox checked={field.value?.includes(item.label)} onCheckedChange={(checked) => { const current = field.value || []; if(checked) { if (current.length < 3) return field.onChange([...current, item.label]); } else { return field.onChange(current.filter(value => value !== item.label)); } }} /></FormControl><FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel></FormItem>)}/>))}</div><FormMessage /></FormItem>} />
                <FormField name="q7_why" control={form.control} render={({ field }) => <FormItem className="mt-4"><FormLabel>Describe brevemente el elemento que seleccionaste.</FormLabel><FormControl><Textarea rows={3} placeholder="¿Qué lo hace especial y único?" {...field} /></FormControl><FormMessage /></FormItem>} />
                {watchedDifferentiation?.includes("Otro") && (
                    <FormField name="q7_other" control={form.control} render={({ field }) => <FormItem className="mt-4"><FormLabel>Por favor, especifica tu diferenciación</FormLabel><FormControl><Textarea rows={3} placeholder="Escribe aquí..." {...field} /></FormControl><FormMessage /></FormItem>} />
                )}
              </div>

              <div className={currentStep === 7 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Sección 3: Propuesta de Valor</h2>
                <p className="text-muted-foreground mb-6">¿Cuál es tu principal valor añadido para tus clientes? (Selecciona hasta 3)</p>
                <FormField name="q8_value" control={form.control} render={({ field }) => <FormItem><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Q8_OPTIONS.map(item => (<FormField key={item} control={form.control} name="q8_value" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-secondary p-3 rounded-md"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => { const current = field.value || []; if(checked) { if (current.length < 3) return field.onChange([...current, item]); } else { return field.onChange(current.filter(value => value !== item)); } }} /></FormControl><FormLabel className="font-normal cursor-pointer">{item}</FormLabel></FormItem>)}/>))}</div><FormMessage /></FormItem>} />
                 {watchedValue?.includes("Otro") && (
                    <FormField name="q8_other" control={form.control} render={({ field }) => <FormItem className="mt-4"><FormLabel>Por favor, especifica tu valor añadido</FormLabel><FormControl><Textarea rows={3} placeholder="Escribe aquí..." {...field} /></FormControl><FormMessage /></FormItem>} />
                )}
              </div>

              <div className={currentStep === 8 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Sección 4: Presencia Online</h2>
                <p className="text-muted-foreground mb-6">¿Qué canales de comunicación y redes sociales utilizas?</p>
                <FormField name="q9_presence" control={form.control} render={({ field }) => <FormItem><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{Q9_OPTIONS.map(item => (<FormField key={item} control={form.control} name="q9_presence" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-secondary p-3 rounded-md"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter(value => value !== item))}} /></FormControl><FormLabel className="font-normal cursor-pointer">{item}</FormLabel></FormItem>)}/>))}</div><FormMessage /></FormItem>} />
                 {watchedPresence?.includes("Otros") && (
                    <FormField name="q9_other" control={form.control} render={({ field }) => <FormItem className="mt-4"><FormLabel>Por favor, especifica otros canales</FormLabel><FormControl><Textarea rows={3} placeholder="Escribe aquí..." {...field} /></FormControl><FormMessage /></FormItem>} />
                )}
              </div>

              <div className={currentStep === 9 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Sección 4: Marketing Digital</h2>
                <p className="text-muted-foreground mb-6">¿Cómo calificarías tu presencia digital actual?</p>
                <FormField name="q10_rating" control={form.control} render={({ field }) => <FormItem>
                  <div className="flex items-center space-x-4"><span className="text-sm">Baja (1)</span><FormControl><Slider min={1} max={10} step={1} defaultValue={[field.value ?? 5]} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl><span className="text-sm">Fuerte (10)</span></div>
                  <div className="text-center mt-4 text-xl font-bold text-primary">{watchedRating}</div>
                <FormMessage /></FormItem>} />
                <p className="text-muted-foreground mb-6 mt-8">¿Cuáles son tus mayores desafíos? (Selecciona hasta 3)</p>
                <FormField name="q10_challenges" control={form.control} render={({ field }) => <FormItem><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Q10_CHALLENGES_OPTIONS.map(item => (<FormField key={item} control={form.control} name="q10_challenges" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-secondary p-3 rounded-md"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => { const current = field.value || []; if(checked) { if (current.length < 3) return field.onChange([...current, item]); } else { return field.onChange(current.filter(value => value !== item)); } }} /></FormControl><FormLabel className="font-normal cursor-pointer">{item}</FormLabel></FormItem>)}/>))}</div><FormMessage /></FormItem>} />
                {watchedChallenges?.includes("Otro") && (
                    <FormField name="q10_other" control={form.control} render={({ field }) => <FormItem className="mt-4"><FormLabel>Por favor, especifica otro desafío</FormLabel><FormControl><Textarea rows={3} placeholder="Escribe aquí..." {...field} /></FormControl><FormMessage /></FormItem>} />
                )}
              </div>
              
              <div className={currentStep === 10 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Sección 5: Visión a Futuro</h2>
                <p className="text-muted-foreground mb-6">¿Te interesa capacitar a otros profesionales?</p>
                <FormField name="q11_training" control={form.control} render={({ field }) => <FormItem><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">{Q11_OPTIONS.map(item => (<FormItem key={item.value} className="flex items-center space-x-3 space-y-0 bg-secondary p-3 rounded-md"><FormControl><RadioGroupItem value={item.label} /></FormControl><FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel></FormItem>))}</RadioGroup></FormControl><FormMessage /></FormItem>} />
                {(watchedTraining === "Sí" || watchedTraining === "No lo había pensado, pero me gustaría saber más") && (
                  <FormField name="q12_details" control={form.control} render={({ field }) => <FormItem className="mt-4"><FormLabel>¿En qué temas específicos te gustaría capacitar?</FormLabel><FormControl><Textarea rows={3} placeholder="Ej: Mi técnica de 'Lifting Facial no invasivo'..." {...field} /></FormControl><FormMessage /></FormItem>} />
                )}
              </div>
              
              <div className={currentStep === 11 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Sección 5: Preferencias Personales</h2>
                <p className="text-muted-foreground mb-6">Un toque final para humanizar tu marca.</p>
                <FormField name="q13_colors" control={form.control} render={({ field }) => <FormItem><FormLabel>Si tu marca tuviera una paleta de colores, ¿cuáles serían y por qué?</FormLabel><FormControl><Textarea rows={3} placeholder="Ej: Verde y blanco porque transmiten calma, salud y pureza." {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField name="q14_hobby" control={form.control} render={({ field }) => <FormItem><FormLabel>¿Qué te gusta hacer en tu tiempo libre? (Opcional)</FormLabel><FormControl><Textarea rows={3} placeholder="¿Algún hobby o interés que te apasione?" {...field} /></FormControl><FormMessage /></FormItem>} />
              </div>
              
              <div className={currentStep === 12 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Reflexión Final</h2>
                <p className="text-muted-foreground mb-6">¿Hay algo más que debamos saber?</p>
                <FormField name="q15_final" control={form.control} render={({ field }) => <FormItem><FormLabel>Cualquier otra cosa que consideres relevante para entender tu visión, necesidades o aspiraciones.</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>} />
              </div>
              
               <div className={currentStep === 13 ? 'block' : 'hidden'}>
                <h2 className="font-headline text-3xl text-primary mb-2">Paso Final: Exportar Datos</h2>
                <p className="text-muted-foreground mb-6">¡Has completado la encuesta! Ahora puedes exportar todas tus respuestas a un archivo CSV para guardarlas o compartirlas.</p>
                <div>
                  <h3 className="font-headline text-xl text-primary mb-4">Análisis de Competencia</h3>
                  <p className="text-muted-foreground mb-6">Nombra algunos competidores clave en tu mercado.</p>
                  {fields.map((field, index) => (
                    <FormField key={field.id} control={form.control} name={`competitors.${index}.name`} render={({ field }) => (
                      <FormItem className="flex items-center gap-2 mb-2">
                        <FormLabel className="sr-only">Competidor {index + 1}</FormLabel>
                        <FormControl><Input placeholder={`Nombre del competidor ${index + 1}`} {...field} /></FormControl>
                         <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ))}
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ name: '' })}><PlusCircle className="mr-2 h-4 w-4" />Añadir Competidor</Button>
                </div>
                 <Button type="button" onClick={() => exportToCsv(form.getValues())} className="mt-8">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar a CSV y finalizar
                  </Button>
              </div>

               <div className={currentStep === 14 ? 'block' : 'hidden'}>
                <div className="text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                  <PartyPopper className="h-16 w-16 text-primary mb-4" />
                  <h2 className="font-headline text-3xl text-primary mb-4">¡Gracias por completar el diagnóstico!</h2>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">Tu archivo CSV se ha descargado correctamente.</p>
                  <p className="text-md text-muted-foreground max-w-md mx-auto">Por favor, comparte el archivo descargado con Ana de Nyvara Group. En breve recibirás tu diagnóstico personalizado.</p>
                </div>
              </div>


              <div className="mt-8 pt-6 border-t-2 border-secondary flex justify-between items-center">
                <div>
                  <Button type="button" onClick={handlePrev} disabled={currentStep === 0 || currentStep === TOTAL_STEPS - 1} variant="secondary">Anterior</Button>
                   {(currentStep === TOTAL_STEPS - 1) && (
                     <Button type="button" onClick={handleStartOver} variant="ghost" className="ml-2">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Volver al inicio
                     </Button>
                   )}
                </div>
                <div className="text-sm text-muted-foreground">Paso {currentStep + 1} de {TOTAL_STEPS}</div>
                
                {currentStep < TOTAL_STEPS - 2 ? (
                  <Button type="button" onClick={handleNext}>Siguiente</Button>
                ) : null}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

    