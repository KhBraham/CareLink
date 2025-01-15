<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    private $huggingFaceUrl = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
    private $systemPrompt = "You are a helpful and friendly healthcare assistant for CareLink Hospital. Engage in natural conversation and provide general health information. Remember to maintain a caring and professional tone.";

    private $predefinedAnswers = [
        // Common Variations of Questions
        '(how|help|tell me) (to )?(book|make|schedule|get) (an )?appointment' => 
            "To book an appointment on CareLink:\n1. Click 'Find a Doctor' in the main menu\n2. Fill out the appointment form with:\n   - Your symptoms or reason for visit\n   - Preferred appointment date\n   - Any relevant medical history\n3. Submit the form\n4. Our system will assign the most suitable doctor based on your needs\n5. You'll receive a confirmation email with your appointment details and assigned doctor.\n\nNote: Doctors are assigned based on their specialization and availability to ensure you get the best care.",

        '(how|what) (to|should|can|do) (I )?(treat|handle|manage|cure|help|deal with) (a |my )?(fever|temperature)' => 
            "To treat a fever: \n1. Rest and stay hydrated\n2. Take over-the-counter medications like acetaminophen\n3. Keep the room temperature comfortable\n4. Use a light blanket if you have chills\n5. Monitor your temperature regularly\n\nSeek immediate medical attention if:\n- Fever is above 103°F (39.4°C)\n- Fever lasts more than 3 days\n- You have severe symptoms\n- You have underlying health conditions",

        '(give|tell|share|provide) (me )?(some |any )?(general |basic )?(health|medical) (information|info|advice|tips)' =>
            "Here are important health tips:\n1. Exercise regularly (30 minutes daily)\n2. Eat a balanced diet with plenty of fruits and vegetables\n3. Get 7-9 hours of sleep each night\n4. Stay hydrated (8 glasses of water daily)\n5. Manage stress through relaxation techniques\n6. Have regular medical check-ups\n7. Maintain good hygiene\n8. Keep vaccinations up to date\n\nFor specific health concerns, please book an appointment with our doctors.",

        // Appointment Booking Questions
        'how (to|do I|can I) (cancel|reschedule) (my )?appointment' =>
            "To cancel or reschedule your appointment:\n1. Go to 'My Appointments' in your dashboard\n2. Find the appointment you want to modify\n3. Click 'Cancel' to cancel, or 'Reschedule' to choose a new time\n4. For rescheduling, select a new available time slot\n\nPlease note: Cancellations should be made at least 24 hours before the appointment.",

        'where (can|do) I (see|find|view) my appointments' =>
            "To view your appointments:\n1. Log into your CareLink account\n2. Go to 'My Appointments' in your dashboard\n3. Here you can see all your upcoming and past appointments\n4. Each appointment shows the assigned doctor's name, date, time, and status\n\nYou can also filter appointments by status (pending, confirmed, completed, or cancelled).",

        'what (happens|do I do) (after|when) I book (an )?appointment' =>
            "After submitting an appointment request:\n1. Our system will assign the most appropriate doctor based on your symptoms\n2. You'll receive a confirmation email with:\n   - Assigned doctor's information\n   - Appointment date and time\n   - Any pre-appointment instructions\n3. You'll get a reminder 24 hours before the appointment\n\nYou can view all appointment details in 'My Appointments' section.",

        'what (info|information) (do I need|is required) (to|for) book(ing)? (an )?appointment' =>
            "To book an appointment, you'll need to provide:\n1. Your symptoms or reason for visit (be as detailed as possible)\n2. Preferred appointment date and time\n3. Any relevant medical history or current medications\n4. Your contact information (automatically filled if logged in)\n\nBased on this information, we'll assign the most suitable doctor for your needs.",

        // General Health Questions
        'what (is|are) (the )?(symptoms|signs) of (covid|covid-19|coronavirus)' => 
            "Common COVID-19 symptoms include fever, cough, fatigue, loss of taste or smell, and difficulty breathing. If you experience these symptoms, please contact your doctor immediately and self-isolate.",

        'what (is|are) (the )?(symptoms|signs) of diabetes' => 
            "Common diabetes symptoms include increased thirst, frequent urination, extreme hunger, unexplained weight loss, fatigue, and blurred vision. If you experience these symptoms, please schedule an appointment with our endocrinologists for proper evaluation.",

        'what (is|are) (the )?(symptoms|signs) of high blood pressure' => 
            "High blood pressure often has no obvious symptoms. However, some people might experience headaches, shortness of breath, or nosebleeds. Regular check-ups are essential for monitoring blood pressure.",

        // Treatment Questions
        'how (is|can|do you) treat (a )?headache' => 
            "For headaches: 1) Rest in a quiet, dark room 2) Stay hydrated 3) Try over-the-counter pain relievers 4) Apply a cold or warm compress. If headaches are severe or frequent, please schedule an appointment with our neurologists.",

        // Prevention Questions
        'how (can|do) I prevent (the )?flu' => 
            "To prevent flu: 1) Get your annual flu shot 2) Wash hands frequently 3) Maintain good hygiene 4) Eat a healthy diet 5) Get adequate sleep. We offer flu shots at our clinic - schedule your appointment today!",

        'how (can|do) I (maintain|have) (good )?health' => 
            "For good health: 1) Exercise regularly 2) Eat a balanced diet 3) Get 7-9 hours of sleep 4) Stay hydrated 5) Manage stress 6) Have regular check-ups. Our wellness center offers personalized health plans!",

        // Emergency Questions
        'what (is|counts as) (a )?medical emergency' => 
            "Medical emergencies include: chest pain, difficulty breathing, severe bleeding, stroke symptoms (FAST), severe allergic reactions, or major injuries. If you experience any of these, call emergency services immediately or visit our emergency department.",

        'when should I go to (the )?emergency( room)?' => 
            "Visit emergency for: severe chest pain, difficulty breathing, severe bleeding, stroke symptoms, severe allergic reactions, or major injuries. For less urgent matters, schedule an appointment with your primary care physician.",

        // Mental Health
        'what (is|about) (depression|anxiety)' => 
            "Depression and anxiety are common mental health conditions that can affect mood, thoughts, and daily activities. Our mental health professionals can provide proper evaluation and support. Don't hesitate to schedule a confidential consultation.",

        // Medication Questions
        'what (are|about) (the )?side effects' => 
            "Side effects vary depending on the specific medication. Always read the medication guide and consult with your doctor or pharmacist. If you experience any unusual reactions, contact your healthcare provider immediately.",

        // Nutrition Questions
        'what (is|about) (a )?healthy diet' => 
            "A healthy diet includes: 1) Plenty of fruits and vegetables 2) Whole grains 3) Lean proteins 4) Limited processed foods and sugar 5) Adequate hydration. Our nutritionists can create a personalized meal plan for you.",

        // Exercise Questions
        'how much exercise (do I need|should I get)' => 
            "Adults should aim for: 1) 150 minutes of moderate activity or 75 minutes of vigorous activity weekly 2) Strength training 2-3 times per week. Consult your doctor before starting a new exercise program.",

        // Sleep Questions
        'how (much|many hours of) sleep do I need' => 
            "Adults typically need 7-9 hours of quality sleep per night. If you're having sleep problems, our sleep specialists can help identify and treat the underlying causes."
    ];

    public function handleMessage(Request $request)
    {
        try {
            $request->validate([
                'messages' => 'required|array',
                'messages.*.role' => 'required|string|in:system,user,assistant',
                'messages.*.content' => 'required|string',
            ]);

            $messages = $request->input('messages');
            $lastMessage = last($messages);
            $userMessage = strtolower(trim($lastMessage['content'] ?? ''));

            // First check platform-specific questions
            $platformResponse = $this->getPlatformResponse($userMessage);
            if ($platformResponse) {
                return response()->json(['message' => $platformResponse]);
            }

            // Then check predefined health-related questions
            $healthResponse = $this->getHealthResponse($userMessage);
            if ($healthResponse) {
                return response()->json(['message' => $healthResponse]);
            }

            // If no predefined answer, use fallback AI model
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . env('HUGGINGFACE_API_KEY'),
                    'Content-Type' => 'application/json',
                ])->post($this->huggingFaceUrl, [
                    'inputs' => $this->systemPrompt . "\n\nUser: " . $userMessage,
                    'parameters' => [
                        'max_length' => 500,
                        'temperature' => 0.7,
                    ]
                ]);

                if ($response->successful()) {
                    $result = $response->json();
                    if (!empty($result[0]['generated_text'])) {
                        return response()->json([
                            'message' => $result[0]['generated_text']
                        ]);
                    }
                }
            } catch (\Exception $e) {
                Log::error('Hugging Face API error: ' . $e->getMessage());
            }

            // If all else fails, return a helpful default response
            return response()->json([
                'message' => "I can help you with:\n1. Booking appointments\n2. Common health questions\n3. Medical advice\n4. Emergency information\n\nPlease ask specific questions like:\n- How do I book an appointment?\n- How to treat a fever?\n- What are COVID symptoms?"
            ]);

        } catch (\Exception $e) {
            Log::error('Chatbot error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to get response from chatbot',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    private function getHealthResponse($message)
    {
        foreach ($this->predefinedAnswers as $pattern => $response) {
            if (preg_match("/$pattern/i", $message)) {
                return $response;
            }
        }
        return null;
    }

    private function getPlatformResponse($message)
    {
        $message = strtolower($message);

        // Only handle platform-specific questions here
        $platformQuestions = [
            'how (to|do I|can I) (book|make|schedule|get) (an )?appointment' =>
                "To book an appointment, click 'Find a Doctor' in the menu, search for your preferred doctor, and select an available time slot. You'll receive a confirmation email once booked.",

            'how (to|do I|can I) (see|view|access|download|get) (my )?medical records?' =>
                "Your medical records are in the 'Medical Records' section. You can view them online or download them as PDF files.",

            'how (to|do I|can I) (see|view|get) (my )?test results' =>
                "Check your test results in the 'Medical Records' section under the 'Test Results' tab. New results will have a 'New' badge.",

            'how (to|do I|can I) (renew|refill) (my )?prescription' =>
                "Go to 'Medical Records', open the 'Prescriptions' tab, and click 'Request Renewal' next to the prescription you need.",

            'how (to|do I|can I) (find|search for) (a )?doctor' =>
                "Use the 'Find a Doctor' section to search by name, specialty, or availability. You can read profiles and book appointments directly.",

            'how (to|do I|can I) (update|change) (my )?insurance' =>
                "Update your insurance information in your profile settings under 'Insurance Information'.",

            'how (to|do I|can I) (reset|change) (my )?password' =>
                "To reset your password, click your profile icon and select 'Security Settings', then 'Change Password'."
        ];

        foreach ($platformQuestions as $pattern => $response) {
            if (preg_match("/$pattern/i", $message)) {
                return $response;
            }
        }

        return null;
    }
}
