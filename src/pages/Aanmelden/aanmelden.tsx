import { SEO } from '../../components/SEO';
import { FormContainer } from './components/FormContainer';
import './styles/index.css';

export default function Aanmelden() {
  return (
    <>
      <SEO 
        title="Aanmelden"
        description="Schrijf je in voor De Koninklijke Loop 2025. Loop mee als deelnemer, begeleider of vrijwilliger en steun het goede doel."
        route="/aanmelden"
        type="article"
      />
      <FormContainer />
    </>
  );
}
