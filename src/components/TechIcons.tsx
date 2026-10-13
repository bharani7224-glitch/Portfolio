import React from 'react';
import type { IconBaseProps } from 'react-icons';
import { 
  SiReact, 
  SiDotnet,
  SiNextdotjs, 
  SiTypescript, 
  SiJavascript, 
  SiTailwindcss, 
  SiNodedotjs, 
  SiExpress, 
  SiPostgresql, 
  SiSupabase, 
  SiOpenai, 
  SiN8N, 
  SiDocker, 
  SiVercel, 
  SiGit, 
  SiPostman,
  SiSwagger,
  SiJsonwebtokens,
  SiHtml5,
  SiGithub
} from 'react-icons/si';
import { GrOracle } from 'react-icons/gr';
import { 
  TbBrandCSharp, 
  TbApi, 
  TbBrain, 
  TbGitBranch,
  TbDatabase,
  TbScan,
  TbLayersIntersect
} from 'react-icons/tb';

export type IconProps = IconBaseProps;

export const ReactIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiReact size={size} {...props} />
);

export const NetCoreIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiDotnet size={size} {...props} />
);

export const OracleIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <GrOracle size={size} {...props} />
);

export const LinqIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <TbBrandCSharp size={size} {...props} />
);

export const SwaggerIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiSwagger size={size} {...props} />
);

export const NextjsIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiNextdotjs size={size} {...props} />
);

export const TypescriptIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiTypescript size={size} {...props} />
);

export const JavascriptIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiJavascript size={size} {...props} />
);

export const TailwindIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiTailwindcss size={size} {...props} />
);

export const NodejsIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiNodedotjs size={size} {...props} />
);

export const ExpressIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiExpress size={size} {...props} />
);

export const PostgresIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiPostgresql size={size} {...props} />
);

export const SupabaseIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiSupabase size={size} {...props} />
);

export const OpenAIIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiOpenai size={size} {...props} />
);

export const GeminiIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <TbBrain size={size} {...props} />
);

export const N8nIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiN8N size={size} {...props} />
);

export const DockerIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiDocker size={size} {...props} />
);

export const VercelIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiVercel size={size} {...props} />
);

export const GitIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiGit size={size} {...props} />
);

export const PostmanIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiPostman size={size} {...props} />
);

export const ApiIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <TbApi size={size} {...props} />
);

export const WorkflowIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <TbGitBranch size={size} {...props} />
);

export const EfCoreIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <TbDatabase size={size} {...props} />
);

export const HtmlCssIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiHtml5 size={size} {...props} />
);

export const CleanArchIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <TbLayersIntersect size={size} {...props} />
);

export const JwtIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiJsonwebtokens size={size} {...props} />
);

export const OcrIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <TbScan size={size} {...props} />
);

export const GithubIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <SiGithub size={size} {...props} />
);
